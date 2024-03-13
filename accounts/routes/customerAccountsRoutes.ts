import { Router } from "express";
import { createCustomer, loginCustomer } from "../controllers/customerAccountsController";

export const router = Router();

router.post("/register", createCustomer);
router.post("/login", loginCustomer);

export default router;
