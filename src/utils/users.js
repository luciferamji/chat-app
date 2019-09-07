const User=require('../model/users')
const Room=require('../model/room')


const adduser =async ({id,username,room})=>{
username=username.trim()
room=room.trim()

if(!username||!room)
return {
    error:'username and room are required'
}
const mongoroom=await Room.findOne({name:room})
const existinguser=await User.findOne({username,roomid:mongoroom._id})


if(existinguser){
return{
    error:'username is in use'
}

}



const mongouser=new User({username,socketid:id,roomid:mongoroom._id})
await mongouser.save()
const user={id,username,room}

return{user}

}
const removeuser=async(id)=>{


const mongouser=await User.findOne({socketid:id})

try{await mongouser.populate('roomid').execPopulate()
await mongouser.remove()
const user={id:mongouser.socketid,username:mongouser.username,room:mongouser.roomid.name}

return user
}
catch(e){console.log(e)}



}

const getuser=async(id)=>{
    const mongouser=await User.findOne({socketid:id})
    await mongouser.populate('roomid').execPopulate()
    const user={id:mongouser.socketid,username:mongouser.username,room:mongouser.roomid.name}
return user
}
const getusersinroom=async (room)=>{
    const mongoroom=await Room.findOne({name:room})
    try{
        await mongoroom.populate('users').execPopulate()
   const users=mongoroom.users
   
    return users}
    catch(e){
        console.log(e)
    }
}

module.exports={
      adduser,
      removeuser,
      getuser,
      getusersinroom

}