import { Document, Schema, model } from 'mongoose';

export interface Meal extends Document {
  name: string;
  price: number;
  description: string;
  image: string;
  restaurant: Schema.Types.ObjectId;
}

const mealSchema: Schema<Meal> = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant' },
});

export default model<Meal>('Meals', mealSchema);
