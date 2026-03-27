import { Router } from "express";
import AuthController from "../controllers/auth.controller";

const router = Router();

// Login
router.post("/login", AuthController.login);

// Refresh token
router.post("/refresh", AuthController.refresh);

export default router;