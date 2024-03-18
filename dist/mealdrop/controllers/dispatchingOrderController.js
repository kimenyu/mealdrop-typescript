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
// import Meal from '../../restaurant/models/Meals';
// import jwt from 'jsonwebtoken';
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
// import { verify } from 'jsonwebtoken';
const customer_1 = __importDefault(require("../../accounts/models/customer"));
const deliveryagent_1 = __importDefault(require("../../accounts/models/deliveryagent"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const dispatchOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const token = Array.isArray(authHeader) ? authHeader[0].split(' ')[1] : authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        const customer_id = decoded.userId;
        console.log(customer_id);
        if (!customer_id) {
            return res.status(404).json({ error: 'Customer not found.' });
        }
        const customer = yield customer_1.default.findById(decoded.userId);
        const deliveryAgent = yield deliveryagent_1.default.findOne({ role: 'deliveryAgent', status: 'available' });
        if (!deliveryAgent) {
            return res.status(404).json({ error: 'No available delivery agent found.' });
        }
        // const { orderId } = req.body;
        const order = yield order_1.default.findOne({ customer: decoded.userId }).populate('customer').populate('deliveryAgent');
        console.log("Order exists: ", !!order);
        if (!order) {
            return res.status(404).json({ error: 'Order not found.' });
        }
        order.status = 'dispatched';
        order.deliveryAgent = deliveryAgent._id;
        yield order.save();
        customer.assignedOrders.push(order._id);
        yield customer.save();
        deliveryAgent.assignedOrders.push(order._id);
        yield deliveryAgent.save();
        const meals = order.meals.map(meal => {
            var _a;
            return ({
                name: meal === null || meal === void 0 ? void 0 : meal.name,
                quantity: meal === null || meal === void 0 ? void 0 : meal.quantity,
                restaurant: (_a = meal.restaurant) === null || _a === void 0 ? void 0 : _a.name,
                totalPrice: (meal === null || meal === void 0 ? void 0 : meal.quantity) && (meal === null || meal === void 0 ? void 0 : meal.price) ? Number(meal.quantity) * Number(meal.price) : 0
            });
        });
        console.log(meals);
        console.log(customer.email, customer.firstname, deliveryAgent.email, deliveryAgent.firstname, meals);
        yield sendOrderDispatchEmail(customer.email, customer.firstname, deliveryAgent.email, deliveryAgent.firstname, meals);
        res.status(200).json({ message: 'Order dispatched successfully.' });
    }
    catch (error) {
        next(error);
    }
});
exports.dispatchOrder = dispatchOrder;
// Function to send order dispatch email
function sendOrderDispatchEmail(customerEmail, customerName, deliveryAgentEmail, deliveryAgentName, Order) {
    return __awaiter(this, void 0, void 0, function* () {
        const transporter = nodemailer_1.default.createTransport({
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
        yield transporter.sendMail(mailOptionsCustomer);
        yield transporter.sendMail(mailOptionsDeliveryAgent);
    });
}
//# sourceMappingURL=dispatchingOrderController.js.map