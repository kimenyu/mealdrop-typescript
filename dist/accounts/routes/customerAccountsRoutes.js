"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const customerAccountsController_1 = require("../controllers/customerAccountsController");
exports.router = (0, express_1.Router)();
exports.router.post("/register", customerAccountsController_1.createCustomer);
exports.router.post("/login", customerAccountsController_1.loginCustomer);
exports.default = exports.router;
//# sourceMappingURL=customerAccountsRoutes.js.map