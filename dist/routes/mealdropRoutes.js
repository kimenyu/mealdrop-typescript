"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const customerAccountsController_1 = require("../accounts/controllers/customerAccountsController");
const adminControllers_1 = require("../accounts/controllers/adminControllers");
const deliveryAgentControllers_1 = require("../accounts/controllers/deliveryAgentControllers");
const restaurantController_1 = require("../restaurant/controller/restaurantController");
const mealControllers_1 = require("../restaurant/controller/mealControllers");
const orderControllers_1 = require("../mealdrop/controllers/orderControllers");
// import { customerAuthMiddleware } from "../middleware/customerAuthMiddleware";
const adminAuthMiddleware_1 = require("../middleware/adminAuthMiddleware");
const cancelOrder_1 = require("../mealdrop/controllers/cancelOrder");
const restaurantOrders_1 = require("../mealdrop/controllers/restaurantOrders");
const customerOrdersContoller_1 = require("../mealdrop/controllers/customerOrdersContoller");
exports.router = (0, express_1.Router)();
exports.router.post("/customer/register", customerAccountsController_1.createCustomer);
exports.router.post("/customer/login", customerAccountsController_1.loginCustomer);
exports.router.post("/customer/verify", customerAccountsController_1.verifyEmail);
//register admin
exports.router.post("/admin/register", adminControllers_1.createAdmin);
exports.router.post("/admin/login", adminControllers_1.loginAdmin);
exports.router.post("/admin/verify", adminControllers_1.verifyEmailAdmin);
exports.router.post("/delivery-agent/register", deliveryAgentControllers_1.createDeliveryAgent);
exports.router.post("/delivery-agent/login", deliveryAgentControllers_1.loginDeliveryAgent);
exports.router.post("/delivery-agent/verify", deliveryAgentControllers_1.verifyEmailCourier);
//restuarant routes
exports.router.post("/restaurant/create", adminAuthMiddleware_1.adminAuthMiddleware, restaurantController_1.createRestaurant);
exports.router.get("/restaurant/all", restaurantController_1.getRestaurants);
exports.router.get("/restaurant/:id", restaurantController_1.getRestaurantById);
exports.router.put("/restaurant/update/:id", adminAuthMiddleware_1.adminAuthMiddleware, restaurantController_1.updateRestaurant);
exports.router.delete("/restaurant/delete/:id", adminAuthMiddleware_1.adminAuthMiddleware, restaurantController_1.deleteRestaurant);
//meal routes
exports.router.post("/meal/create", adminAuthMiddleware_1.adminAuthMiddleware, mealControllers_1.createMeal);
exports.router.get("/meal/all", mealControllers_1.getMeals);
exports.router.get("/meal/:id", mealControllers_1.getMealById);
exports.router.delete("/meal/delete/:id", adminAuthMiddleware_1.adminAuthMiddleware, mealControllers_1.deleteMealById);
exports.router.put("/meal/update/:id", adminAuthMiddleware_1.adminAuthMiddleware, mealControllers_1.updateMeal);
//orders
exports.router.post("/order/create", orderControllers_1.createOrder);
exports.router.delete('/orders/cancel/:orderId', cancelOrder_1.cancelOrder);
exports.router.get('/users/my-orders', customerOrdersContoller_1.getUserOrders); //get user orders
//restaurant orders
exports.router.get('/restaurants/:restaurantId/orders', restaurantOrders_1.getAllOrdersByRestaurant); //fetching orders by restaurant
exports.default = exports.router;
//# sourceMappingURL=mealdropRoutes.js.map