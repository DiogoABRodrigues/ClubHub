import { Router } from "express";
import newsController from "../controllers/news.controller";
import { upload } from "../middlewares/upload";

const router = Router();

router.post("/", upload.single("image"), newsController.create);
router.get("/", newsController.getAll);
router.get("/last10", newsController.getLast10);
router.put("/:id", upload.single("image"), newsController.update);
router.delete("/:id", newsController.delete);

export default router;