import { Router } from "express";
import newsController from "../controllers/news.controller";
import { upload } from "../middlewares/upload";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

// GET (livres)
router.get("/", newsController.getAll);
router.get("/last10", newsController.getLast10);

// ADMIN ONLY
router.post(
  "/",
  authMiddleware,
  authorizeRoles("admin"),
  upload.single("image"),
  newsController.create,
);

router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  upload.single("image"),
  newsController.update,
);

router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  newsController.delete,
);

export default router;
