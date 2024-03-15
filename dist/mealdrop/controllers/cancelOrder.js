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
exports.cancelOrder = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const order_1 = __importDefault(require("../models/order"));
const cancelOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const token = Array.isArray(authHeader) ? authHeader[0].split(' ')[1] : authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const customer_id = decoded.userId;
        const orderId = req.params.orderId; // Assuming the order ID is passed as a route parameter
        const order = yield order_1.default.findOne({ _id: orderId, customer: customer_id });
        if (!order) {
            return res.status(404).json({ error: 'Order not found or unauthorized' });
        }
        // Perform cancellation logic here, such as updating order status to canceled
        order.status = 'canceled';
        yield order.save();
        res.status(200).json({ msg: 'Order canceled successfully', data: order });
    }
    catch (error) {
        console.error(error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        res.status(500).json({ error: 'Something wrong happened' });
    }
});
exports.cancelOrder = cancelOrder;
//# sourceMappingURL=cancelOrder.js.map