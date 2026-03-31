import { Router } from "express";
import StatementController from "../controllers/statement.controller";
import { authMiddleware, authorizeRoles } from "../middlewares/authMiddleware";

const router = Router();

router.post(
  "/",
  StatementController.create,
);
router.put(
  "/:id",
  StatementController.update,
);
router.get("/", StatementController.getActiveStatements);

router.delete(
  "/:id",
  StatementController.deleteStatement,
); 

export default router;
