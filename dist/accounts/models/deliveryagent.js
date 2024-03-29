"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mongoose_1 = require("mongoose");
const deliveryAgentSchema = new mongoose_1.Schema({
    firstname: { type: String },
    lastname: { type: String },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: 'deliveryAgent' },
    phoneNum: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    status: { type: String, enum: ['available', 'unavailable'], default: 'available' },
    assignedOrders: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Order' }],
});
exports.default = (0, mongoose_1.model)('DeliveryAgent', deliveryAgentSchema);
//# sourceMappingURL=deliveryagent.js.map