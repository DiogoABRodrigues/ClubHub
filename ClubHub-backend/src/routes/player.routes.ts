import { Router } from "express";
import CompController from "../controllers/competition.controller";
import PlayerController from "../controllers/player.controller";

const router = Router();

router.get("/", CompController.getAll);
router.get("/season/:seasonId", CompController.getBySeasonId);
router.get("/current", CompController.getByCurrentSeasonId);
router.put("/:playerId", PlayerController.updatePlayer);
export default router;
