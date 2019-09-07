const path = require('path')
require('./db/mongoose')
const http = require('http')
const express = require('express')
const bcryptjs = require('bcryptjs')
const Room= require('./model/room')
const socketio = require('socket.io')
const {adduser,removeuser,getuser,getusersinroom}=require('./utils/users')
const { generateMessage, generateLocationMessage } = require('./utils/messages')

const app = express()

const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.json())
app.use(express.static(publicDirectoryPath))
app.post('/createroom',async(req,res)=>{
    
const room=new Room(req.body)
try{
    await room.save()
    res.status(201).send({name:room.name})
}
catch(e){
   
    res.status(200).send({error:e.message})
}
})

app.post('/joinroom',async(req,res)=>{
try{
   
let room=await Room.findOne({name:req.body.name})

if(!room)
return res.status(200).send({error:"room not found"})

const ismatch = await bcryptjs.compare(req.body.password, room.password)

if (!ismatch)
return res.status(200).send({error:"password is not matching"})  
room=await room.show()
return res.send(room)
}
catch(e){
    console.log(e)
}


})


io.on('connection',async (socket) => {
   
   
   
    socket.on('join',async({username,room},callback)=>{
            
        const{error,user} =  await adduser({id:socket.id,username,room})
    if(error){
    return callback(error)
    }
    
        socket.join(user.room)
    socket.emit('message', generateMessage("CHATAPP",'Welcome!'))
    socket.broadcast.to(user.room).emit('message', generateMessage("CHATAPP",`${username} has joined!`))
    
io.to(user.room).emit("roomdata",{
room:user.room,
users:await getusersinroom(user.room)
})



  callback()
})

    
    socket.on('sendMessage', async(message, callback) => {
        const user=await getuser(socket.id)
     
        io.to(user.room).emit('message', generateMessage(user.username,message))
        callback()
    })

    socket.on('sendLocation', async (coords, callback) => {
        const user=await getuser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect', async() => {
      const user = await  removeuser(socket.id)
      
      if(user){
          io.to(user.room).emit('message', generateMessage("CHATAPP",`${user.username}  has left!`))
          const roomusers=await getusersinroom(user.room)
          if(roomusers.length==0)
          {
           
                    return await Room.findOneAndDelete({name:user.room})
          }
          io.to(user.room).emit("roomdata",{
            room:user.room,
            users:await getusersinroom(user.room)
            })
      
      
        }
      
        
    })

  


})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})