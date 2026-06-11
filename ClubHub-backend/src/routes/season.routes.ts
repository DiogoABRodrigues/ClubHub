import { Router } from "express";
import SeasonController from "../controllers/season.controller";

const router = Router();

router.get("/", SeasonController.getAll);
router.get("/current", SeasonController.getByCurrentSeasonId);
router.get("/by-category/:category", SeasonController.getByCategory);
router.get("/season/:seasonId", SeasonController.getBySeasonId);

export default router;