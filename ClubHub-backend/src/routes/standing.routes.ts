import { Router } from "express";
import StandingController from "../controllers/standing.controller";

const router = Router();

router.get("/", StandingController.getAll);
router.get("/season/:seasonId", StandingController.getBySeasonId);
router.get("/current", StandingController.getByCurrentSeasonId);

export default router;
