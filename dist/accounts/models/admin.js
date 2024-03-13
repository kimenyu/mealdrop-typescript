"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mongoose_1 = require("mongoose");
const adminSchema = new mongoose_1.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: 'admin' },
    location: { type: String, required: true },
    phoneNum: { type: String, required: true },
});
exports.default = (0, mongoose_1.model)('Admin', adminSchema);
//# sourceMappingURL=admin.js.map