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
exports.updateOrder = void 0;
const order_1 = __importDefault(require("../models/order"));
const Meals_1 = __importDefault(require("../../restaurant/models/Meals"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const joi_1 = __importDefault(require("joi"));
const validateJoiSche_1 = require("../../utils/validations/validateJoiSche");
const validationSchema = joi_1.default.object({
    meals: joi_1.default.array()
        .min(1)
        .items(joi_1.default.object({
        meal_id: joi_1.default.string().required(),
        quantity: joi_1.default.number().integer().min(1).required(),
    }))
        .required(),
});
const updateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = (0, validateJoiSche_1.validateJoiSchema)(req.body, validationSchema, {
            stripUnknown: true,
        });
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const token = Array.isArray(authHeader) ? authHeader[0].split(' ')[1] : authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const customer_id = decoded.userId;
        const order_id = req.params.orderId; // Assuming you're passing orderId as a URL parameter
        const order = yield order_1.default.findById(order_id);
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
            const meal = yield Meals_1.default.findById(item.meal_id);
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
        yield order.save();
        res.status(200).json({ msg: 'Order updated successfully', data: order });
    }
    catch (error) {
        console.error(error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        res.status(500).json({ error: 'Something wrong happened' });
    }
});
exports.updateOrder = updateOrder;
//# sourceMappingURL=updateOrderController.js.map