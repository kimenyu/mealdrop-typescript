import { Document, Schema, model } from 'mongoose';

export interface Order extends Document {
    customer: Schema.Types.ObjectId;
    meals: {
        meal: Schema.Types.ObjectId;
        quantity: number;
    }[];
    totalPrice: number;
    totalQuantity: number;
    status: string;
    createdAt: Date;
}

const orderSchema: Schema<Order> = new Schema({
    customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    meals: [{
        meal: { type: Schema.Types.ObjectId, ref: 'Meals', required: true },
        quantity: { type: Number, required: true }
    }],
    totalPrice: { type: Number, required: true },
    totalQuantity: { type: Number, required: true },
    status: { type: String, required: true, default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

export default model<Order>('Order', orderSchema);
