import Meal from "../models/Meals";
import { Request, Response } from 'express';
import Restaurant from "../models/restaurantModel";
import { ObjectId } from "mongoose";


//create meal
export const createMeal = async (req: Request, res: Response) => {
    const { name, price, description, image, restaurant } = req.body;

    try {
        const newMeal = await Meal.create({
            name,
            price,
            description,
            image,
            restaurant
        });
        //update the corresponding restaurant with the meal
        await Restaurant.findByIdAndUpdate(
            restaurant,
            { $push: { meals: newMeal._id } }, { new: true }
        );
        res.status(201).json({ message: "Meal created successfully" });
        console.log(newMeal);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//get all meals
export const getMeals = async (req: Request, res: Response) => {
    try {
        const meals = await Meal.find({});
        res.status(200).json(meals);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//get a single meal
export const getMealById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const meal = await Meal.findById(id);
        res.status(200).json(meal);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//delete a meal
export const deleteMealById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedMeal = await Meal.findByIdAndDelete(id);

        if (deletedMeal) {
            // Find the corresponding restaurant
            const restaurant = await Restaurant.findById(deletedMeal.restaurant);

            if (restaurant) {
                // Remove the meal's ID from the restaurant's meals array
                restaurant.meals = restaurant.meals.filter((mealId: ObjectId) => mealId !== deletedMeal._id);
                await restaurant.save();
            }

            res.status(200).json({ message: 'Meal deleted successfully' });
        } else {
            res.status(404).json({ error: 'Meal not found' });
        }
    } catch (error) {
        console.error('Error deleting meal:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

//update a meal
export const updateMeal = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, description, price, image } = req.body;
        const updatedMeal = await Meal.findByIdAndUpdate(
            id,
            { name, description, price, image },
            { new: true }
        );
        if (updatedMeal) {
            res.status(200).json({ meal: updatedMeal });
        } else {
            res.status(404).json({ error: 'Meal not found' });
        }
    } catch (error) {
        console.error('Error updating meal:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
