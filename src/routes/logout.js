import { Router } from "express";
import { logout } from "../controllers/logout.js";

const router = Router();
router.post('/logout', logout);

export default router;