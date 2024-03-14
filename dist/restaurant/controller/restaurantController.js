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
exports.deleteRestaurant = exports.updateRestaurant = exports.getRestaurantById = exports.getRestaurants = exports.createRestaurant = void 0;
const Meals_1 = __importDefault(require("../models/Meals"));
const restaurantModel_1 = __importDefault(require("../models/restaurantModel"));
// Create a new restaurant
const createRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, address, image, owner } = req.body;
    try {
        const newRestaurant = new restaurantModel_1.default({
            name,
            description,
            address,
            image,
            owner
        });
        const restaurant = yield newRestaurant.save();
        res.status(201).json(restaurant);
        console.log(restaurant);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createRestaurant = createRestaurant;
// Get all restaurants
const getRestaurants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurants = yield restaurantModel_1.default.find({});
        res.status(200).json(restaurants);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getRestaurants = getRestaurants;
// Get a single restaurant
const getRestaurantById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const restaurant = yield restaurantModel_1.default.findById(id).populate('meals');
        res.status(200).json(restaurant);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getRestaurantById = getRestaurantById;
// Update a restaurant
const updateRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, description, address, image, owner } = req.body;
    try {
        const restaurant = yield restaurantModel_1.default.findByIdAndUpdate(id, {
            name,
            description,
            address,
            image,
            owner
        });
        res.status(200).json(restaurant);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateRestaurant = updateRestaurant;
// Delete a restaurant
const deleteRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedRestaurant = yield restaurantModel_1.default.findByIdAndDelete(id);
        //delete all meals asscociated with the restaurant
        if (deletedRestaurant) {
            const relatedMeals = yield Meals_1.default.find({ _id: { $in: deletedRestaurant.meals } });
            if (relatedMeals.length > 0) {
                yield Meals_1.default.deleteMany({ _id: { $in: relatedMeals.map(meal => meal._id) } });
            }
        }
        res.status(200).json({ message: "Restaurant deleted successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteRestaurant = deleteRestaurant;
//# sourceMappingURL=restaurantController.js.map