"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mealSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    restaurant: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Restaurant' },
});
exports.default = (0, mongoose_1.model)('Meals', mealSchema);
//# sourceMappingURL=Meals.js.map