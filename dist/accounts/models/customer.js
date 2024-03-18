"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const customerSchema = new mongoose_1.Schema({
    firstname: { type: String },
    lastname: { type: String },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: 'customer' },
    phoneNum: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    location: {
        longitude: { type: String },
        latitude: { type: String },
        address: { type: String }
    },
    assignedOrders: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Order' }], // Reference to Order model
});
exports.default = (0, mongoose_1.model)('Customer', customerSchema);
//# sourceMappingURL=customer.js.map