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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dispatchOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const token = Array.isArray(authHeader) ? authHeader[0].split(' ')[1] : authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user_id = decoded.userId;
        console.log(user_id);
        const order_id = req.params.orderId; // Assuming you're passing orderId as a URL parameter
        const order = yield order_1.default.findById(order_id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        if (order.status !== 'pending') {
            return res.status(400).json({ error: 'Order is not in a dispatchable state' });
        }
        // You can perform additional checks or actions here before dispatching the order
        order.status = 'dispatched'; // Update the order status to 'dispatched'
        yield order.save();
        res.status(200).json({ msg: 'Order dispatched successfully', data: order });
    }
    catch (error) {
        console.error(error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        res.status(500).json({ error: 'Something wrong happened' });
    }
});
exports.dispatchOrder = dispatchOrder;
//# sourceMappingURL=dispatchingOrderController.js.map