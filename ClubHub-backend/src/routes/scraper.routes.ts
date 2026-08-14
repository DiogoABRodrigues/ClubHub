import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import scrapeJobService from "../services/scrapeJob.service";

const router = Router();

/**
 * O Render termina pedidos HTTP lentos. Estes endpoints só colocam o job em
 * fila (202); o estado persistido em Redis pode ser consultado até ao fim.
 */
router.post(
  "/allInfo",
  authMiddleware,
  authorizeRoles("admin"),
  async (_req, res) => {
    try {
      const job = await scrapeJobService.start("all");
      res.status(202).json(job);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Erro ao iniciar scraper" });
    }
  },
);

// Executa os mesmos parsers mas não altera PostgreSQL, cache de dados ou notificações.
router.post(
  "/dry-run",
  authMiddleware,
  authorizeRoles("admin"),
  async (_req, res) => {
    try {
      const job = await scrapeJobService.start("all", "dry-run");
      res.status(202).json(job);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Erro ao iniciar dry run" });
    }
  },
);

router.post(
  "/category/:category",
  authMiddleware,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const job = await scrapeJobService.start(String(req.params.category));
      res.status(202).json(job);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Erro ao iniciar scraper" });
    }
  },
);

router.get(
  "/jobs/:id",
  authMiddleware,
  authorizeRoles("admin"),
  async (req, res) => {
    const job = await scrapeJobService.get(String(req.params.id));
    if (!job) {
      res.status(404).json({ message: "Job não encontrado ou expirado" });
      return;
    }
    res.json(job);
  },
);

export default router;
