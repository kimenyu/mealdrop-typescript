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
exports.searchMeals = exports.updateMeal = exports.deleteMealById = exports.getMealById = exports.getMeals = exports.createMeal = void 0;
const Meals_1 = __importDefault(require("../models/Meals"));
const restaurantModel_1 = __importDefault(require("../models/restaurantModel"));
//create meal
const createMeal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, price, description, image, restaurant } = req.body;
    try {
        const newMeal = yield Meals_1.default.create({
            name,
            price,
            description,
            image,
            restaurant
        });
        //update the corresponding restaurant with the meal
        yield restaurantModel_1.default.findByIdAndUpdate(restaurant, { $push: { meals: newMeal._id } }, { new: true });
        res.status(201).json({ message: "Meal created successfully" });
        console.log(newMeal);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createMeal = createMeal;
//get all meals
const getMeals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const meals = yield Meals_1.default.find({});
        res.status(200).json(meals);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getMeals = getMeals;
//get a single meal
const getMealById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const meal = yield Meals_1.default.findById(id);
        res.status(200).json(meal);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getMealById = getMealById;
//delete a meal
const deleteMealById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedMeal = yield Meals_1.default.findByIdAndDelete(id);
        if (deletedMeal) {
            // Find the corresponding restaurant
            const restaurant = yield restaurantModel_1.default.findById(deletedMeal.restaurant);
            if (restaurant) {
                // Remove the meal's ID from the restaurant's meals array
                restaurant.meals = restaurant.meals.filter((mealId) => mealId !== deletedMeal._id);
                yield restaurant.save();
            }
            res.status(200).json({ message: 'Meal deleted successfully' });
        }
        else {
            res.status(404).json({ error: 'Meal not found' });
        }
    }
    catch (error) {
        console.error('Error deleting meal:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.deleteMealById = deleteMealById;
//update a meal
const updateMeal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, description, price, image } = req.body;
        const updatedMeal = yield Meals_1.default.findByIdAndUpdate(id, { name, description, price, image }, { new: true });
        if (updatedMeal) {
            res.status(200).json({ meal: updatedMeal });
        }
        else {
            res.status(404).json({ error: 'Meal not found' });
        }
    }
    catch (error) {
        console.error('Error updating meal:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.updateMeal = updateMeal;
//search meals by name
const searchMeals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.query;
        // Check if name parameter is provided
        if (!name || typeof name !== 'string') {
            return res.status(400).json({ error: 'Name parameter is required' });
        }
        // Search meals by name
        const meals = yield Meals_1.default.find({ name: { $regex: new RegExp(name, 'i') } });
        if (meals.length === 0) {
            return res.status(404).json({ error: 'No meals found with the provided name' });
        }
        // Return the found meals
        res.json(meals);
    }
    catch (error) {
        console.error('Error searching meals by name:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.searchMeals = searchMeals;
//# sourceMappingURL=mealControllers.js.map