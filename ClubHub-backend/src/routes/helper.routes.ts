import { Router } from "express";
import HelperController from "../controllers/helper.controller";

const router = Router();

router.get("/categories", HelperController.getAllCategoriesAvailable);


export default router;
