import { Router } from "express";
import TeamController from "../controllers/team.controller";

const router = Router();

router.get("/", TeamController.getAll);
router.get("/season/:seasonId", TeamController.getByName);

export default router;