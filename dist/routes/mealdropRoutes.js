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
exports.router.post("/customer/verify", customerAccountsController_1.verifyEmail);
//register admin
exports.router.post("/admin/register", adminControllers_1.createAdmin);
exports.router.post("/admin/login", adminControllers_1.loginAdmin);
exports.router.post("/admin/verify", adminControllers_1.verifyEmailAdmin);
exports.router.post("/delivery-agent/register", deliveryAgentControllers_1.createDeliveryAgent);
exports.router.post("/delivery-agent/login", deliveryAgentControllers_1.loginDeliveryAgent);
exports.router.post("/delivery-agent/verify", deliveryAgentControllers_1.verifyEmailCourier);
exports.default = exports.router;
//# sourceMappingURL=mealdropRoutes.js.map