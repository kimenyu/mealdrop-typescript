import { Router } from "express";
import { createCustomer, loginCustomer, verifyEmail } from "../accounts/controllers/customerAccountsController";
import { createAdmin, loginAdmin, verifyEmailAdmin } from "../accounts/controllers/adminControllers";
import { createDeliveryAgent, loginDeliveryAgent, verifyEmailCourier } from "../accounts/controllers/deliveryAgentControllers";
import { createRestaurant, getRestaurants, getRestaurantById, updateRestaurant, deleteRestaurant } from "../restaurant/controller/restaurantController";
import { createMeal, getMeals, getMealById, deleteMealById, updateMeal } from "../restaurant/controller/mealControllers";
import { createOrder } from "../mealdrop/controllers/orderControllers";
// import { customerAuthMiddleware } from "../middleware/customerAuthMiddleware";
import { adminAuthMiddleware } from "../middleware/adminAuthMiddleware";
import { cancelOrder } from "../mealdrop/controllers/cancelOrder";
import { getAllOrdersByRestaurant } from "../mealdrop/controllers/restaurantOrders";
import { getUserOrders } from "../mealdrop/controllers/customerOrdersContoller";
import { updateOrder } from "../mealdrop/controllers/updateOrderController";
import { dispatchOrder } from "../mealdrop/controllers/dispatchingOrderController";

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
router.post("/restaurant/create", adminAuthMiddleware, createRestaurant);
router.get("/restaurant/all", getRestaurants);
router.get("/restaurant/:id", getRestaurantById);
router.put("/restaurant/update/:id", adminAuthMiddleware, updateRestaurant);
router.delete("/restaurant/delete/:id", adminAuthMiddleware, deleteRestaurant);

//meal routes
router.post("/meal/create", adminAuthMiddleware, createMeal);
router.get("/meal/all", getMeals);
router.get("/meal/:id", getMealById);
router.delete("/meal/delete/:id", adminAuthMiddleware, deleteMealById);
router.put("/meal/update/:id", adminAuthMiddleware, updateMeal);


//orders
router.post("/order/create", createOrder);
router.delete('/orders/cancel/:orderId', cancelOrder);
router.get('/users/my-orders', getUserOrders); //get user orders
router.put('/order/update/:orderId', updateOrder);
router.post('/order/dispatch/:orderId', dispatchOrder);

//restaurant orders
router.get('/restaurants/:restaurantId/orders', getAllOrdersByRestaurant); //fetching orders by restaurant


export default router;
