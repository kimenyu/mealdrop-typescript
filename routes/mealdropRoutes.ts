import { Router } from "express";
import { createCustomer, loginCustomer, verifyEmail } from "../accounts/controllers/customerAccountsController";
import { createAdmin, loginAdmin, verifyEmailAdmin } from "../accounts/controllers/adminControllers";
import { createDeliveryAgent, loginDeliveryAgent, verifyEmailCourier } from "../accounts/controllers/deliveryAgentControllers";
import { createRestaurant, getRestaurants, getRestaurantById, updateRestaurant, deleteRestaurant } from "../restaurant/controller/restaurantController";
import { createMeal, getMeals, getMealById, deleteMealById, updateMeal } from "../restaurant/controller/mealControllers";
import { createOrder } from "../mealdrop/controllers/orderControllers";

export const router = Router();

router.post("/customer/register", createCustomer);
router.post("/customer/login", loginCustomer);
router.post("/customer/verify", verifyEmail);
//register admin
router.post("/admin/register", createAdmin);
router.post("/admin/login", loginAdmin);
router.post("/admin/verify", verifyEmailAdmin);


router.post("/delivery-agent/register", createDeliveryAgent);
router.post("/delivery-agent/login", loginDeliveryAgent);
router.post("/delivery-agent/verify", verifyEmailCourier);

//restuarant routes
router.post("/restaurant/create", createRestaurant);
router.get("/restaurant/all", getRestaurants);
router.get("/restaurant/:id", getRestaurantById);
router.put("/restaurant/update/:id", updateRestaurant);
router.delete("/restaurant/delete/:id", deleteRestaurant);

//meal routes
router.post("/meal/create", createMeal);
router.get("/meal/all", getMeals);
router.get("/meal/:id", getMealById);
router.delete("/meal/delete/:id", deleteMealById);
router.put("/meal/update/:id", updateMeal);


//orders
router.post("/order/create", createOrder);
export default router;
