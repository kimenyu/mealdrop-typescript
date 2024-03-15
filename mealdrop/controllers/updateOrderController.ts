import { Request, Response } from 'express';
import Order from '../models/order';
import Meal from '../../restaurant/models/Meals';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import { validateJoiSchema } from '../../utils/validations/validateJoiSche';

const validationSchema = Joi.object({
  meals: Joi.array()
    .min(1)
    .items(
      Joi.object({
        meal_id: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required(),
      })
    )
    .required(),
});

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const payload = validateJoiSchema(req.body, validationSchema, {
      stripUnknown: true,
    });

    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = Array.isArray(authHeader) ? authHeader[0].split(' ')[1] : authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const customer_id = decoded.userId;

    const order_id = req.params.orderId; // Assuming you're passing orderId as a URL parameter
    const order = await Order.findById(order_id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.customer.toString() !== customer_id) {
      return res.status(403).json({ error: 'Unauthorized to update this order' });
    }

    const { meals } = payload;

    let total_price = 0;
    let total_quantity = 0;

    for (const item of meals) {
      const meal = await Meal.findById(item.meal_id);

      if (!meal) {
        return res.status(400).json({ error: `Meal with id ${item.meal_id} does not exist` });
      }

      total_quantity += item.quantity;
      total_price += meal.price * item.quantity;
    }

    order.meals = meals.map(item => ({
      meal: item.meal_id,
      quantity: item.quantity,
    }));
    order.totalPrice = total_price;
    order.totalQuantity = total_quantity;

    await order.save();

    res.status(200).json({ msg: 'Order updated successfully', data: order });
  } catch (error) {
    console.error(error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Something wrong happened' });
  }
};