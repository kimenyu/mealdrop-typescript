"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const customerAccountsController_1 = require("../accounts/controllers/customerAccountsController");
const adminControllers_1 = require("../accounts/controllers/adminControllers");
const deliveryAgentControllers_1 = require("../accounts/controllers/deliveryAgentControllers");
exports.router = (0, express_1.Router)();
exports.router.post("/customer/register", customerAccountsController_1.createCustomer);
exports.router.post("/customer/login", customerAccountsController_1.loginCustomer);
//register admin
exports.router.post("/admin/register", adminControllers_1.createAdmin);
exports.router.post("/admin/login", adminControllers_1.loginAdmin);
exports.router.post("/deliveryAgent/register", deliveryAgentControllers_1.createDeliveryAgent);
exports.router.post("/deliveryAgent/login", deliveryAgentControllers_1.loginDeliveryAgent);
exports.default = exports.router;
//# sourceMappingURL=mealdropRoutes.js.map