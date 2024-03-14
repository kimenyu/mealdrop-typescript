import Meal from "../models/Meals";
import { Request, Response } from 'express';
import Restaurant from "../models/restaurantModel";

// Create a new restaurant
export const createRestaurant = async (req: Request, res: Response) => {
    const { name, description, address, image, owner} = req.body;

    try {
        const newRestaurant = new Restaurant({
            name,
            description,
            address,
            image,
            owner
        });
        const restaurant = await newRestaurant.save();
        res.status(201).json(restaurant);
        console.log(restaurant);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get all restaurants
export const getRestaurants = async (req: Request, res: Response) => {
    try {
        const restaurants = await Restaurant.find({});
        res.status(200).json(restaurants);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get a single restaurant
export const getRestaurantById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const restaurant = await Restaurant.findById(id).populate('meals');
        res.status(200).json(restaurant);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update a restaurant
export const updateRestaurant = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, address, image, owner} = req.body;
    try {
        const restaurant = await Restaurant.findByIdAndUpdate(id, {
            name,
            description,
            address,
            image,
            owner
        });
        res.status(200).json(restaurant);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete a restaurant
export const deleteRestaurant = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deletedRestaurant = await Restaurant.findByIdAndDelete(id);

        //delete all meals asscociated with the restaurant
        if(deletedRestaurant) {
            const relatedMeals = await Meal.find({_id: { $in: deletedRestaurant.meals }});
            
            if(relatedMeals.length > 0) {
                await Meal.deleteMany({_id: { $in: relatedMeals.map(meal => meal._id)}});
            }
        }

        res.status(200).json({message: "Restaurant deleted successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};