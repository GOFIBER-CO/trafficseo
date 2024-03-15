import mongoose from "mongoose"


const Messages = new mongoose.Schema({
 
    from: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    content: {
        type: String,
    },

    urlPath:{   
        type: String,
        default: ''
    },
    nameFile:{
        type: String,
        default:''
    },
    type: {
        type: String,
        enum: ['text', 'file', 'image'],
        default: 'text',
    }
}, {
    timestamps: true
})

const Message = mongoose.model("messages", Messages)
export default Message