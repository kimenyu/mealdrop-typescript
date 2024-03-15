"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dispatchOrder = void 0;
const order_1 = __importDefault(require("../models/order"));
const deliveryagent_1 = __importDefault(require("../../accounts/models/deliveryagent"));
const Meals_1 = __importDefault(require("../../restaurant/models/Meals"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const dispatchOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const token = Array.isArray(authHeader) ? authHeader[0].split(' ')[1] : authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded); // Log decoded token
        const user_id = decoded.userId;
        const user_email = decoded.userEmail;
        console.log(user_id);
        if (!user_email) {
            return res.status(400).json({ error: 'User email not found in token' });
        }
        const order_id = req.params.orderId;
        const order = yield order_1.default.findById(order_id)
            .populate('meals.meal')
            .populate({
            path: 'meals.meal',
            populate: {
                path: 'restaurant',
                model: 'Restaurant',
            },
        })
            .populate('customer');
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        if (order.status !== 'pending') {
            return res.status(400).json({ error: 'Order is not in a dispatchable state' });
        }
        // Assign the order to a delivery agent
        const availableDriver = yield deliveryagent_1.default.findOne({ status: 'available' });
        if (!availableDriver) {
            return res.status(404).json({ error: 'No available delivery agent' });
        }
        order.status = 'dispatched';
        order.deliveryAgent = availableDriver._id;
        availableDriver.assignedOrders.push(order._id);
        const mealPromises = order.meals.map((mealItem) => __awaiter(void 0, void 0, void 0, function* () {
            const meal = yield Meals_1.default.findById(mealItem.meal.toString());
            return { name: meal.name, quantity: mealItem.quantity, price: meal.price };
        }));
        const mealsData = yield Promise.all(mealPromises);
        const restaurant = order.meals[0].restaurant;
        // Send email to delivery agent
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SENDER_EMAIL,
                pass: process.env.SENDER_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
        const mailOptionsToDriver = {
            from: process.env.SENDER_EMAIL,
            to: availableDriver.email,
            subject: 'New Order Assigned',
            html: `
        <p>Hello,</p>
        <p>You have been assigned with an order. Here are the details:</p>
        <p>Restaurant: ${restaurant.name}</p>
        <p>Order ID: ${order._id}</p>
        <p>Meals:</p>
        <ul>
          ${mealsData.map(meal => `<li>${meal.name} (Quantity: ${meal.quantity}, Price: ${meal.price})</li>`).join('')}
        </ul>
        <p>Total Price: ${order.totalPrice}</p>
        <p>Thank you for choosing us!</p>
      `,
        };
        transporter.sendMail(mailOptionsToDriver, (error, info) => {
            if (error) {
                console.error('Error sending email to driver:', error);
            }
            else {
                console.log('Email sent to driver:', info.response);
            }
        });
        // Send email to user
        const mailOptionsToUser = {
            from: process.env.SENDER_EMAIL,
            to: user_email,
            subject: 'Order Dispatched',
            html: `
        <p>Hello,</p>
        <p>Your order has been dispatched. Here are the details:</p>
        <p>Restaurant: ${restaurant.name}</p>
        <p>Order ID: ${order._id}</p>
        <p>Meals:</p>
        <ul>
          ${mealsData.map(meal => `<li>${meal.name} (Quantity: ${meal.quantity}, Price: ${meal.price})</li>`).join('')}
        </ul>
        <p>Total Price: ${order.totalPrice}</p>
        <p>Thank you for choosing us!</p>
      `,
        };
        if (user_email) {
            transporter.sendMail(mailOptionsToUser, (error, info) => {
                if (error) {
                    console.error('Error sending email to user:', error);
                }
                else {
                    console.log('Email sent to user:', info.response);
                }
            });
        }
        else {
            console.error('Invalid or missing recipient email address');
            return res.status(400).json({ error: 'Invalid or missing recipient email address' });
        }
        res.status(200).json({ msg: 'Order dispatched successfully', data: order });
    }
    catch (error) {
        console.error(error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        res.status(500).json({ error: 'Something went wrong' });
    }
});
exports.dispatchOrder = dispatchOrder;
//# sourceMappingURL=dispatchingOrderController.js.map