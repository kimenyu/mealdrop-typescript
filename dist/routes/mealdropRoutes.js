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
exports.router.post("/restaurant/create", restaurantController_1.createRestaurant);
exports.router.get("/restaurant/all", restaurantController_1.getRestaurants);
exports.router.get("/restaurant/:id", restaurantController_1.getRestaurantById);
exports.router.put("/restaurant/update/:id", restaurantController_1.updateRestaurant);
exports.router.delete("/restaurant/delete/:id", restaurantController_1.deleteRestaurant);
//meal routes
exports.router.post("/meal/create", mealControllers_1.createMeal);
exports.router.get("/meal/all", mealControllers_1.getMeals);
exports.router.get("/meal/:id", mealControllers_1.getMealById);
exports.router.delete("/meal/delete/:id", mealControllers_1.deleteMealById);
exports.router.put("/meal/update/:id", mealControllers_1.updateMeal);
//orders
exports.router.post("/order/create", orderControllers_1.createOrder);
exports.default = exports.router;
//# sourceMappingURL=mealdropRoutes.js.map