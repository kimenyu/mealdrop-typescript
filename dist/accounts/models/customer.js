"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mongoose_1 = require("mongoose");
const customerSchema = new mongoose_1.Schema({
    firstname: { type: String },
    lastname: { type: String },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: 'customer' },
    location: { type: String },
    phoneNum: { type: String, required: true },
});
exports.default = (0, mongoose_1.model)('Customer', customerSchema);
//# sourceMappingURL=customer.js.map