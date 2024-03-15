"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    customer: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Customer', required: true },
    meals: [{
            meal: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Meals', required: true },
            quantity: { type: Number, required: true }
        }],
    totalPrice: { type: Number, required: true },
    totalQuantity: { type: Number, required: true },
    status: { type: String, required: true, default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    deliveryAgent: { type: mongoose_1.Schema.Types.ObjectId, ref: 'DeliveryAgent' }
});
exports.default = (0, mongoose_1.model)('Order', orderSchema);
//# sourceMappingURL=order.js.map