import { Router } from "express";
import MatchController from "../controllers/match.controller";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

// GET (sem restrição)
router.get("/", MatchController.getAll);
router.get("/season/:seasonId", MatchController.getBySeasonId);
router.get("/current", MatchController.getByCurrentSeasonId);
router.get("/by-competition/:competitionId", MatchController.getByCompetitionId);

// ADMIN ONLY
router.post(
  "/",
  authMiddleware,
  authorizeRoles("admin"),
  MatchController.create,
);

router.patch(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  MatchController.update,
);

router.patch(
  "/:id/date-time",
  authMiddleware,
  authorizeRoles("admin"),
  MatchController.updateDateTime,
);

router.patch(
  "/:id/score",
  authMiddleware,
  authorizeRoles("admin"),
  MatchController.updateScore,
);

router.patch(
  "/:id/location",
  authMiddleware,
  authorizeRoles("admin"),
  MatchController.updateLocation,
);

router.patch(
  "/:id/events",
  authMiddleware,
  authorizeRoles("admin"),
  MatchController.updateEvents,
);

router.patch(
  "/:id/status",
  authMiddleware,
  authorizeRoles("admin"),
  MatchController.updateStatus,
);

router.patch(
  "/:id/outcome",
  authMiddleware,
  authorizeRoles("admin"),
  MatchController.updateOutcome,
);

export default router;
