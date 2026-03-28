import { Router } from "express";
import MatchController from "../controllers/match.controller";

const router = Router();

router.get("/", MatchController.getAll);
router.get("/season/:seasonId", MatchController.getBySeasonId);
router.get("/current", MatchController.getByCurrentSeasonId);

router.post("/", MatchController.create);

router.patch("/:id", MatchController.update);

router.patch("/:id/date-time", MatchController.updateDateTime);
router.patch("/:id/score", MatchController.updateScore);
router.patch("/:id/location", MatchController.updateLocation);
router.patch("/:id/events", MatchController.updateEvents);
router.patch("/:id/status", MatchController.updateStatus);
router.patch("/:id/outcome", MatchController.updateOutcome);

export default router;