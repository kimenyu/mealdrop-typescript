// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Document, Schema, model, Model } from 'mongoose';

export interface Admin extends Document {
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    password: string;
    role: string;
    location: string;
    phoneNum: string;
    createdAt: Date;
}

const adminSchema: Schema<Admin> = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true },
    role: { type: String, required: true, default: 'admin'},
    location: { type: String, required: true },
    phoneNum: { type: String, required: true },
});

export default model<Admin>('Admin', adminSchema);