import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import MeController from "../controllers/me.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/login", (req, res, next) => AuthController.login(req, res, next));
router.post("/refresh", (req, res, next) => AuthController.refresh(req, res, next));
router.post("/logout", authMiddleware, (req, res, next) =>
  AuthController.logout(req, res, next),
);

router.get("/me", authMiddleware, (req, res, next) => MeController.me(req, res, next));

export default router;