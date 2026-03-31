import { Router } from "express";
import StatementController from "../controllers/statement.controller";
import { authMiddleware, authorizeRoles } from "../middlewares/authMiddleware";

const router = Router();

router.post(
  "/",
  authMiddleware,
  authorizeRoles("admin"),
  StatementController.create,
);
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  StatementController.update,
);
router.get("/", StatementController.getActiveStatements);

export default router;
