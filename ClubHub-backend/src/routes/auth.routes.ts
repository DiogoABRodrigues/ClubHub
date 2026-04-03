import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import MeController from "../controllers/me.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/login", (req, res) => AuthController.login(req, res));
router.post("/refresh", (req, res) => AuthController.refresh(req, res));
router.post("/logout", authMiddleware, (req, res) =>
  AuthController.logout(req, res),
);

router.get("/me", authMiddleware, (req, res) => MeController.me(req, res));

export default router;
