// import { Request, Response } from 'express';
// // import { validationResult } from 'express-validator';
// import Order from '../models/order';
// import Customer from '../../accounts/models/customer';
// import Meal from '../../restaurant/models/Meals';
// import jwt from 'jsonwebtoken';
// interface JwtPayload {
//   id: string;
//   iat: number;
//   exp: number;
// }
// export const createOrder = async (req: Request, res: Response) => {
//   try {
//     let token = req.headers.authorization?.split(' ')[1];
//     if (!token) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }
//     if (token.startsWith('Bearer ')) {
//       token = token.slice(7);
//     }
//     const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
//     const { id } = decoded;
//     const customer = await Customer.findById(id);
//     if (!customer) {
//       return res.status(404).json({ message: 'Customer not found' });
//     }
//     const { meals, location } = req.body;
//     const mealsData = await Promise.all(
//       meals.map(async (meal: { id: string; quantity: number }) => {
//         const mealDoc = await Meal.findById(meal.id);
//         if (!mealDoc) {
//           throw new Error(`Meal with ID ${meal.id} not found`);
//         }
//         return {
//           meal: mealDoc._id,
//           quantity: meal.quantity,
//           price: mealDoc.price,
//         };
//       })
//     );
//     const totalPrice = mealsData.reduce((acc, meal) => acc + meal.price * meal.quantity, 0);
//     const totalQuantity = mealsData.reduce((acc, meal) => acc + meal.quantity, 0);
//     const order = new Order({
//       customer: customer._id,
//       meals: mealsData,
//       totalPrice,
//       totalQuantity,
//       status:'pending',
//       createdAt: new Date(),
//       location,
//     });
//     await order.save();
//     res.status(201).json({ message: 'Order created successfully', order });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// };
//# sourceMappingURL=tokencontroler.js.map