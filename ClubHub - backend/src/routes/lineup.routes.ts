import { Router } from "express";
import LineupController from "../controllers/lineup.controller";

const router = Router();

router.get("/", LineupController.getAll);
router.get("/season/:seasonId", LineupController.getBySeasonId);
router.get("/current", LineupController.getByCurrentSeasonId);

export default router;