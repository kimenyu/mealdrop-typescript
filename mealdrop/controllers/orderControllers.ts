import { Request, Response } from 'express';
// import { validationResult } from 'express-validator';
import Order from '../models/order';
import Customer from '../../accounts/models/customer';
import Meal from '../../restaurant/models/Meals';
import jwt from 'jsonwebtoken';
import Joi from "joi";
import { validateJoiSchema } from "../../utils/validations/validateJoiSche";

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

export const createOrder = async (req: Request, res: Response) => {
  try {
    const payload = validateJoiSchema(req.body, validationSchema, {
      stripUnknown: true
    });

    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = Array.isArray(authHeader) ? authHeader[0].split(' ')[1] : authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const customer_id = decoded.userId;

    const customer = await Customer.findById(customer_id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    let total_price = 0;
    let total_quantity = 0;
    const { meals } = payload;

    for (const item of meals) {
      const meal = await Meal.findById(item.meal_id);

      if (!meal) {
        return res.status(400).json({ error: `Meal with id ${item.meal_id} does not exist` });
      }

      total_quantity += item.quantity;
      total_price += meal.price * item.quantity;
    }

    const order = new Order({
      customer: customer_id,
      meals: meals.map(item => ({
        meal: item.meal_id,
        quantity: item.quantity
      })),
      totalPrice: total_price,
      totalQuantity: total_quantity
    });

    await order.save();

    res.status(201).json({ msg: "Order created successfully", data: order });
  } catch (error) {
    console.error(error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: "Something wrong happened" });
  }
};