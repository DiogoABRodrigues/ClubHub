import { Router } from "express";
import SeasonController from "../controllers/season.controller";

const router = Router();

router.get("/", SeasonController.getAll);
router.get("/season/:seasonId", SeasonController.getBySeasonId);
router.get("/current", SeasonController.getByCurrentSeasonId);

export default router;