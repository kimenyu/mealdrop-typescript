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
exports.getAllOrdersByRestaurant = void 0;
const order_1 = __importDefault(require("../models/order"));
const restaurantModel_1 = __importDefault(require("../../restaurant/models/restaurantModel"));
const getAllOrdersByRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurantId = req.params.restaurantId; // Assuming the restaurant ID is passed as a route parameter
        const restaurant = yield restaurantModel_1.default.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }
        const orders = yield order_1.default.find({ 'meals.meal': { $in: restaurant.meals } });
        res.status(200).json({ data: orders });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});
exports.getAllOrdersByRestaurant = getAllOrdersByRestaurant;
//# sourceMappingURL=restaurantOrders.js.map