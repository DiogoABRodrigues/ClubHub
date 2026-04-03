import { Router } from "express";
import appSettingsController from "../controllers/appSettings.controller";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

// toggle notifications
router.post(
  "/notifications/toggle",
  authMiddleware,
  authorizeRoles("admin"),
  (req, res) => appSettingsController.toggleNotifications(req, res),
);

// get settings
router.get("/settings", authMiddleware, authorizeRoles("admin"), (req, res) =>
  appSettingsController.getSettings(req, res),
);

export default router;
