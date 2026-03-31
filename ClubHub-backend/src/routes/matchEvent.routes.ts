import { Router } from "express";
import {
  createMatchEvent,
  updateMatchEvent,
  deleteMatchEvent,
} from "../controllers/matchEvent.controller";

const router = Router();

// criar evento
router.post("/:matchId/events", createMatchEvent);

// editar evento
router.put("/events/:id", updateMatchEvent);

// apagar evento
router.delete("/events/:id", deleteMatchEvent);

export default router;