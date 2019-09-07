const mongoose=require("mongoose")

const userschema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique:true
    },
    socketid: {
        type: String,
        required: true,
        trim: true
        },
        roomid: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'room'
        }
        
    
}, {
    timestamps: true
})


    // roomschema.methods.show = async function () {

    //     const room = this
    //     roomobject = room.toObject()
    //     delete roomobject._id
    //     delete roomobject.password
        
    //     return roomobject
    // }




const User=mongoose.model("user",userschema)

module.exports=User