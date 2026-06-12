import { Router } from "express";
import feedbackController from "../controllers/feedback.controller";
import { upload } from "../middlewares/upload";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

// POST público - qualquer utilizador pode enviar feedback
router.post(
  "/",
  upload.single("image"),
  feedbackController.create,
);

// GET restrito a admin - para consultar o feedback recebido
router.get(
  "/",
  authMiddleware,
  authorizeRoles("admin"),
  feedbackController.findAll,
);

export default router;
