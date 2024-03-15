import mongoose, {Schema, Document} from "mongoose";
import {CommentType} from "../interfaces";
export interface CommentModel extends CommentType, Document {}

const CommentSchema: Schema = new Schema({
    content: {type: String, required: true},
    userId: {type: Schema.Types.ObjectId, ref: 'user'},
    postId: {type: Schema.Types.ObjectId, ref: 'post'},
    like: [{type: Schema.Types.ObjectId, ref: 'user'}],
    reply: [{type: Schema.Types.ObjectId, ref: 'reply'}],
},{
    timestamps: true
});


export default mongoose.model<CommentModel>('comment', CommentSchema);  



