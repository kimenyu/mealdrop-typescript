// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Document, Schema, model, Model } from 'mongoose';

export interface DeliveryAgent extends Document {
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    password: string;
    role: string;
    phoneNum: string;
    createdAt: Date;
    isVerified: boolean;
    verificationCode?: string; 
    status: 'available' | 'unavailable';
    assignedOrders: Schema.Types.ObjectId[];

}

const deliveryAgentSchema: Schema<DeliveryAgent> = new Schema({
    firstname: { type: String },
    lastname: { type: String },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true },
    role: { type: String, required: true, default: 'deliveryAgent'},
    phoneNum: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    status: { type: String, enum: ['available', 'unavailable'], default: 'available' },
    assignedOrders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
});

export default model<DeliveryAgent>('DeliveryAgent', deliveryAgentSchema);