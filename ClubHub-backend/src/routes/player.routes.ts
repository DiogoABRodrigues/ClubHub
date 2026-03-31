import { Router } from "express";
import PlayerController from "../controllers/player.controller";

const router = Router();

router.get("/", PlayerController.getAll);
router.get("/season/:seasonId", PlayerController.getBySeasonId);
router.get("/current", PlayerController.getByCurrentSeasonId);
router.put("/:playerId", PlayerController.updatePlayer);
export default router;
