// Role: API Endpoint mapping.
// Imported In: src / index.ts

import { Router } from "express";
import { getAllNiches } from "../controllers/niche/index.js";

const router = Router();
router.get("/all", getAllNiches);

export default router;