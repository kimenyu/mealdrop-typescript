import { Router } from "express";
import { createCustomer, loginCustomer } from "../accounts/controllers/customerAccountsController";
import { createAdmin, loginAdmin } from "../accounts/controllers/adminControllers";
import { createDeliveryAgent, loginDeliveryAgent } from "../accounts/controllers/deliveryAgentControllers";

export const router = Router();

router.post("/customer/register", createCustomer);
router.post("/customer/login", loginCustomer);

//register admin
router.post("/admin/register", createAdmin);
router.post("/admin/login", loginAdmin);

router.post("/delivery-agent/register", createDeliveryAgent);
router.post("/delivery-agent/login", loginDeliveryAgent);



export default router;
