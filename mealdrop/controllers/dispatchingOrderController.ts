import { Request, Response, NextFunction } from 'express';
import Order from '../models/order';
// import Meal from '../../restaurant/models/Meals';
// import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
// import { verify } from 'jsonwebtoken';
import  Customer  from '../../accounts/models/customer';
import DeliveryAgent  from '../../accounts/models/deliveryagent';
import jwt from 'jsonwebtoken';

dotenv.config();
interface DecodedToken {
  userId: string;
  userEmail: string;
  role: string;
  iat: number;
  exp: number;
  customerId: string;
}

export const dispatchOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = Array.isArray(authHeader) ? authHeader[0].split(' ')[1] : authHeader.split(' ')[1];
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;
    console.log(decoded);
    const customer_id = decoded.userId;
    console.log(customer_id);

    if (!customer_id) {
      return res.status(404).json({ error: 'Customer not found.' });
    }

    const customer = await Customer.findById(decoded.userId);

    const deliveryAgent = await DeliveryAgent.findOne({ role: 'deliveryAgent', status: 'available' });
    if (!deliveryAgent) {
      return res.status(404).json({ error: 'No available delivery agent found.' });
    }

    // const { orderId } = req.body;

    const order = await Order.findOne({ customer: decoded.userId }).populate('customer').populate('deliveryAgent');
    console.log("Order exists: ", !!order);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    order.status = 'dispatched';
    order.deliveryAgent = deliveryAgent._id;
    await order.save();

    customer.assignedOrders.push(order._id);
    await customer.save();

    deliveryAgent.assignedOrders.push(order._id);
    await deliveryAgent.save();

    const meals: { name: string; quantity: number; restaurant: string; totalPrice: number;}[] = order.meals.map(meal => ({
      name: meal?.name as string,
      quantity: meal?.quantity,
      restaurant: (meal as unknown as { restaurant: { name: string } }).restaurant?.name as string,
      totalPrice: meal?.quantity && meal?.price ? Number(meal.quantity) * Number(meal.price) : 0
    }));

    console.log(meals);
    console.log(customer.email, customer.firstname, deliveryAgent.email, deliveryAgent.firstname, meals);

    await sendOrderDispatchEmail(customer.email, customer.firstname, deliveryAgent.email, deliveryAgent.firstname, meals);

    res.status(200).json({ message: 'Order dispatched successfully.' });
  } catch (error) {
    next(error);
  }
};

// Function to send order dispatch email
async function sendOrderDispatchEmail(customerEmail: string, customerName: string, deliveryAgentEmail: string, deliveryAgentName: string, Order: { name: string; quantity: number; restaurant: string; totalPrice: number;}[]) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOptionsCustomer = {
    from: process.env.SENDER_EMAIL,
    to: customerEmail,
    subject: 'Order Dispatched',
    text: `Dear ${customerName}, your order has been dispatched.`
  };

  const mailOptionsDeliveryAgent = {
    from: process.env.SENDER_EMAIL,
    to: deliveryAgentEmail,
    subject: 'New Order Assignment',
    html: `
      <h1>New Order Assignment</h1>
      <p>Dear courier, you have been assigned a new order.</p>
       ${Order}, ${deliveryAgentName}
    `,
  };

  await transporter.sendMail(mailOptionsCustomer);
  await transporter.sendMail(mailOptionsDeliveryAgent);
}
