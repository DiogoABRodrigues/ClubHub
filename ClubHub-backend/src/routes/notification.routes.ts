import { Router } from "express";
import notificationController from "../controllers/notification.controller";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

router.post(
  "/",
  authMiddleware,
  authorizeRoles("admin"),
  notificationController.create,
);

export default router;
