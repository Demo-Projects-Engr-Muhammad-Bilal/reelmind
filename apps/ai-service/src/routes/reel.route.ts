import { Router } from "express";
import { toggleReelVisibility, getUserHistory, getPublicGallery, cancelGeneration } from "../controllers/reel/reel.controller.js";

const router = Router();

router.get("/gallery", getPublicGallery);
router.get("/history/:userId", getUserHistory);
router.patch("/:id/toggle-public", toggleReelVisibility);
router.post("/:id/cancel", cancelGeneration); // ⚡ NEW: Cancel Route

export default router;