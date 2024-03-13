"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mongoose_1 = require("mongoose");
const adminSchema = new mongoose_1.Schema({
    firstname: { type: String },
    lastname: { type: String },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: 'admin' },
    location: { type: String },
    phoneNum: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
});
exports.default = (0, mongoose_1.model)('Admin', adminSchema);
//# sourceMappingURL=admin.js.map