const mongoose=require("mongoose")
const bcryptjs = require('bcryptjs')
const roomschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique:true
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true
        
        
    },
    
}, {
    timestamps: true
})
roomschema.virtual('users',{
    ref:'user',
    localField:'_id',
    foreignField:'roomid'
})

roomschema.pre('save', async function () {
    const room = this
    if (room.isModified('password')) {
        room.password = await bcryptjs.hash(room.password, 8)
    }
})

    roomschema.methods.show = async function () {

        const room = this
        roomobject = room.toObject()
        delete roomobject._id
        delete roomobject.password
        
        return roomobject
    }




const Room=mongoose.model("room",roomschema)

module.exports=Room