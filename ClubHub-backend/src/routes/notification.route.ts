import { Router } from "express";
import NotificationController from "../controllers/notification.controller";
import { authMiddleware, authorizeRoles } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware, authorizeRoles("admin"), NotificationController.create);
router.put("/:id", authMiddleware, authorizeRoles("admin"), NotificationController.update);
router.get("/", NotificationController.getAll);

export default router;