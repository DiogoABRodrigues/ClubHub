import { Router } from "express";
import CompetitionController from "../controllers/competition.controller";

const router = Router();

router.get("/", CompetitionController.getAll);
router.get("/season/:seasonId", CompetitionController.getBySeasonId);
router.get("/current", CompetitionController.getByCurrentSeasonId);

export default router;