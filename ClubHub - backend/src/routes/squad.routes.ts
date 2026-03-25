import { Router } from "express";
import SquadController from "../controllers/squad.controller";

const router = Router();

router.get("/", SquadController.getAll);
router.get("/season/:seasonId", SquadController.getBySeasonId);
router.get("/current", SquadController.getByCurrentSeasonId);

export default router;