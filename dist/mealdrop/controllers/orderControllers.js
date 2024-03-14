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
exports.createOrder = void 0;
// import { validationResult } from 'express-validator';
const order_1 = __importDefault(require("../models/order"));
const customer_1 = __importDefault(require("../../accounts/models/customer"));
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
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = (0, validateJoiSche_1.validateJoiSchema)(req.body, validationSchema, {
            stripUnknown: true
        });
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const token = Array.isArray(authHeader) ? authHeader[0].split(' ')[1] : authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const customer_id = decoded.userId;
        const customer = yield customer_1.default.findById(customer_id);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        let total_price = 0;
        let total_quantity = 0;
        const { meals } = payload;
        for (const item of meals) {
            const meal = yield Meals_1.default.findById(item.meal_id);
            if (!meal) {
                return res.status(400).json({ error: `Meal with id ${item.meal_id} does not exist` });
            }
            total_quantity += item.quantity;
            total_price += meal.price * item.quantity;
        }
        const order = new order_1.default({
            customer: customer_id,
            meals: meals.map(item => ({
                meal: item.meal_id,
                quantity: item.quantity
            })),
            totalPrice: total_price,
            totalQuantity: total_quantity
        });
        yield order.save();
        res.status(201).json({ msg: "Order created successfully", data: order });
    }
    catch (error) {
        console.error(error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        res.status(500).json({ error: "Something wrong happened" });
    }
});
exports.createOrder = createOrder;
//# sourceMappingURL=orderControllers.js.map