
import mongoose, { Schema, Document } from 'mongoose';
import { ActionHistoryType } from '../interfaces';

export interface ActionHistory extends ActionHistoryType, Document { }

const ActionHistoryModel: Schema = new Schema(
    {
        actionName: { type: String, required: true },
        user: { type: mongoose.Types.ObjectId, ref: "user" },
        requestDetail: {
            type: String,
            required: true
        },
        ip: { type: String, required: true }
    },
    {
        timestamps: true,
    }
);

ActionHistoryModel.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});

export default mongoose.model<ActionHistory>('actionhistorys', ActionHistoryModel);
