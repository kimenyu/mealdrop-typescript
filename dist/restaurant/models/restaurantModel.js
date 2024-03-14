"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const restaurantSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    owner: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Admin' },
    meals: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Meal' }],
});
exports.default = (0, mongoose_1.model)('Restaurant', restaurantSchema);
//# sourceMappingURL=restaurantModel.js.map