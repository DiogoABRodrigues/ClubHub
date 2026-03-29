import { Router } from "express";
import LineupController from "../controllers/lineup.controller";

const router = Router();

router.get("/", LineupController.getAll); 
router.post("/", LineupController.create);
router.patch("/:id", LineupController.update);
router.delete("/", LineupController.deleteByMatch); 

export default router;