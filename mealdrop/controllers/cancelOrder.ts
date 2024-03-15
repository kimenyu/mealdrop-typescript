import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Order from '../models/order';

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = Array.isArray(authHeader) ? authHeader[0].split(' ')[1] : authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const customer_id = decoded.userId;

    const orderId = req.params.orderId; // Assuming the order ID is passed as a route parameter

    const order = await Order.findOne({ _id: orderId, customer: customer_id });
    if (!order) {
      return res.status(404).json({ error: 'Order not found or unauthorized' });
    }

    // Perform cancellation logic here, such as updating order status to canceled
    order.status = 'canceled';
    await order.save();

    res.status(200).json({ msg: 'Order canceled successfully', data: order });
  } catch (error) {
    console.error(error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Something wrong happened' });
  }
};