import { Router } from "express";
import LineupController from "../controllers/lineup.controller";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

router.get("/", LineupController.getAll);
router.post(
  "/",
  authMiddleware,
  authorizeRoles("admin"),
  LineupController.create
);

router.patch(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  LineupController.update
);

router.delete(
  "/",
  authMiddleware,
  authorizeRoles("admin"),
  LineupController.deleteByMatch
);

export default router;
