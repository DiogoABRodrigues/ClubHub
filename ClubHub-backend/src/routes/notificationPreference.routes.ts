import { Router } from "express";
import * as preferenceController from "../controllers/notificationPreference.controller";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

router.post(
  "/add",
  authMiddleware,
  authorizeRoles("admin"),
  preferenceController.addOrUpdatePreference,
);
router.delete(
  "/remove",
  authMiddleware,
  authorizeRoles("admin"),
  preferenceController.removePreference,
);

export default router;
