import { Document, Schema, model } from 'mongoose';
import { Admin } from "../../accounts/models/admin";
import { Meal } from "./Meals";
export interface Restaurant extends Document {
  name: string;
  address: string;
  image: string;
  description: string;
  owner: Admin['_id'];
  meals: Meal['_id'][];
}

const restaurantSchema: Schema<Restaurant> = new Schema({
    name: { type: String, required: true, unique: true},
    address: { type: String, required: true },
    image: { type: String, required: true},
    description: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'Admin' },
    meals: [{ type: Schema.Types.ObjectId, ref: 'Meal' }],
});

export default model<Restaurant>('Restaurant', restaurantSchema);