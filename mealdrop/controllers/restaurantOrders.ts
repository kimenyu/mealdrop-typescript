import { Request, Response } from 'express';
import Order from '../models/order';
import Restaurant from '../../restaurant/models/restaurantModel';

export const getAllOrdersByRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurantId = req.params.restaurantId; // Assuming the restaurant ID is passed as a route parameter
    const restaurant = await Restaurant.findById(restaurantId);
    
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const orders = await Order.find({ 'meals.meal': { $in: restaurant.meals } });

    res.status(200).json({ data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
