import { Router } from "express";
import * as deviceController from "../controllers/device.controller";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post(
  "/register",
  authMiddleware,
  authorizeRoles("admin"),
  deviceController.registerDevice,
);

export default router;
