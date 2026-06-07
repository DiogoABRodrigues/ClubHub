import { Router } from "express";
import PlayerController from "../controllers/player.controller";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

// GET (livres)
router.get("/", PlayerController.getAll);
router.get("/season/:seasonId", PlayerController.getBySeasonId);
router.get("/current", PlayerController.getByCurrentSeasonId);
router.get("/:playerId/allstats", PlayerController.getAllStatsByPlayerId);

// ADMIN ONLY
router.put(
  "/:playerId",
  authMiddleware,
  authorizeRoles("admin"),
  PlayerController.updatePlayer,
);

export default router;