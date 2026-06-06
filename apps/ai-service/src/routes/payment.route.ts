import { Router } from "express";
import { createCheckout, getCreditPackages } from "../controllers/payment/payment.controller.js";

const router = Router();

// ⚡ NOTE: Webhook yahan nahi hai kyunke usko raw data chahiye, wo index.ts mein hoga.
router.post("/create-checkout", createCheckout);
router.get("/packages", getCreditPackages); // ⚡ NEW ROUTE


export default router;