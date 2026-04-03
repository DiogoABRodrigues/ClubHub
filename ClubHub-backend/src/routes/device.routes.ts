import { Router } from "express";
import deviceController from "../controllers/device.controller";

const router = Router();

// registar / atualizar device
router.post("/", deviceController.register);

// atualizar preferências
router.patch("/:id", deviceController.updatePreferences);

router.get("/:id", deviceController.getById);

export default router;
