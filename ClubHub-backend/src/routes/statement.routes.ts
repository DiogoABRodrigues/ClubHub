import { Router } from "express";
import StatementController from "../controllers/statement.controller";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

// GET (livre)
router.get("/", StatementController.getActiveStatements);

// ADMIN ONLY
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

router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  StatementController.deleteStatement,
);

export default router;
