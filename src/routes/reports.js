import { Router } from "express";
import { report } from "../controllers/reports.js";
import { authMiddleware } from "../middleware/session.js";

const router = Router();

router.post("/", authMiddleware , report); //  http://localhost:3000/api/reports


export default router;