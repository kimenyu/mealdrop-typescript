import { Document, Schema, model } from 'mongoose';
// import Order from '../../mealdrop/models/order';
export interface Customer extends Document {
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    password: string;
    role: string;
    phoneNum: string;
    isVerified: boolean;
    createdAt: Date;
    verificationCode?: string;
    location: {
        longitude: string;
        latitude: string;
        address: string;
    };
    assignedOrders: Schema.Types.ObjectId[]; // Array of Order IDs
}

const customerSchema: Schema<Customer> = new Schema({
    firstname: { type: String },
    lastname: { type: String },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: 'customer' },
    phoneNum: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    location: {
        longitude: { type: String },
        latitude: { type: String },
        address: { type: String }
    },
    assignedOrders: [{ type: Schema.Types.ObjectId, ref: 'Order' }], // Reference to Order model
});

export default model<Customer>('Customer', customerSchema);
