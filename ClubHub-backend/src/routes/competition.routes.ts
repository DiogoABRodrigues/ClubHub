import { Router } from "express";
import CompetitionController from "../controllers/competition.controller";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

router.get("/", CompetitionController.getAll);
router.get("/season/:seasonId", CompetitionController.getBySeasonId);
router.get("/current", CompetitionController.getByCurrentSeasonId);

router.put(
  "/:competitionId/legend",
  authMiddleware,
  authorizeRoles("admin"),
  CompetitionController.updateLegend,
);

export default router;