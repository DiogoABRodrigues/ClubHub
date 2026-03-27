import { Router } from "express";
import StatsController from "../controllers/stats.controller";

const router = Router();

router.get("/", StatsController.getAll);
router.get("/season/:seasonId", StatsController.getBySeasonId);
router.get("/current", StatsController.getByCurrentSeasonId);

export default router;
