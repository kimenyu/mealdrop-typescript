import { Request, Response } from 'express';
import Order from '../models/order';
import jwt from 'jsonwebtoken';

export const dispatchOrder = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = Array.isArray(authHeader) ? authHeader[0].split(' ')[1] : authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.userId;
    console.log(user_id);

    const order_id = req.params.orderId; // Assuming you're passing orderId as a URL parameter
    const order = await Order.findById(order_id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Order is not in a dispatchable state' });
    }

    // You can perform additional checks or actions here before dispatching the order

    order.status = 'dispatched'; // Update the order status to 'dispatched'
    await order.save();

    res.status(200).json({ msg: 'Order dispatched successfully', data: order });
  } catch (error) {
    console.error(error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Something wrong happened' });
  }
};