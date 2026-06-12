import { Router } from "express";
import SquadController from "../controllers/squad.controller";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

router.get("/", SquadController.getAll);
router.get("/season/:seasonId", SquadController.getBySeasonId);
router.get("/current", SquadController.getByCurrentSeasonId);

// Admin only - atualiza o status do jogador no squad daquela época
router.patch(
  "/:playerExternalId/season/:seasonId/status",
  authMiddleware,
  authorizeRoles("admin"),
  SquadController.updateStatus,
);

export default router;
