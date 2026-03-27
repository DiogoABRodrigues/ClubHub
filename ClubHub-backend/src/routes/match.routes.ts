import { Router } from "express";
import MatchController from "../controllers/match.controller";
const router = Router();

router.get("/", MatchController.getAll);
router.get("/season/:seasonId", MatchController.getBySeasonId);
router.get("/current", MatchController.getByCurrentSeasonId);

export default router;
