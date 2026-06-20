import { Router } from "express";
import feedbackController from "../controllers/feedback.controller";
import { upload } from "../middlewares/upload";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import rateLimit from "express-rate-limit";

const router = Router();
const feedbackLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many feedback submissions" },
});

// POST público - qualquer utilizador pode enviar feedback
router.post(
  "/",
  feedbackLimiter,
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
