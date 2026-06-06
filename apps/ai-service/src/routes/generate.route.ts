import express from "express";
import * as GenController from "../controllers/generate/index.js";
import { 
    startFullProduction, 
    startAssetProduction, 
    startVideoProduction, 
    startCompositionProduction 
} from "../controllers/generate/production.controller.js";

const router = express.Router();

router.get("/history/:userId", GenController.getUserHistory);
router.post("/hooks", GenController.generateHooksPhase);

// Script Route (Ab yeh single scene retake bhi handle karega)
router.post("/script", GenController.generateScriptPhase);

// Unified & Granular Routes (In mein worker already sceneOrder handle kar raha hai)
router.post("/full-production", startFullProduction);
router.post("/assets", startAssetProduction);
router.post("/video", startVideoProduction);
router.post("/composition", startCompositionProduction);

export default router;