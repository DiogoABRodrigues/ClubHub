import { Router } from "express";
import {
  createMatchEvent,
  updateMatchEvent,
  deleteMatchEvent,
} from "../controllers/matchEvent.controller";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

// ADMIN ONLY
router.post(
  "/:matchId/events",
  authMiddleware,
  authorizeRoles("admin"),
  createMatchEvent
);

router.put(
  "/events/:id",
  authMiddleware,
  authorizeRoles("admin"),
  updateMatchEvent
);

router.delete(
  "/events/:id",
  authMiddleware,
  authorizeRoles("admin"),
  deleteMatchEvent
);

export default router;