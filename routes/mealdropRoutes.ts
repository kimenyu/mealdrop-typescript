import { Router } from "express";
import { createCustomer, loginCustomer, verifyEmail } from "../accounts/controllers/customerAccountsController";
import { createAdmin, loginAdmin, verifyEmailAdmin } from "../accounts/controllers/adminControllers";
import { createDeliveryAgent, loginDeliveryAgent, verifyEmailCourier } from "../accounts/controllers/deliveryAgentControllers";

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



export default router;
