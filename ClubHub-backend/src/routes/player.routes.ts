import { Router } from "express";
import PlayerController from "../controllers/competition.controller";

const router = Router();

router.get("/", PlayerController.getAll);
router.get("/season/:seasonId", PlayerController.getBySeasonId);
router.get("/current", PlayerController.getByCurrentSeasonId);

export default router;
