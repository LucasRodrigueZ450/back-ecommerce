// src/routes/productRoutes.js
import { Router } from "express";
import productController from "../controllers/productController.js";
import authenticateToken from "../middleware/auth.js";

const router = Router();

// ROTAS PÚBLICAS
router.get("/", (req, res) => productController.getAll(req, res));
router.get("/:id", (req, res) => productController.getById(req, res));

// ROTAS PROTEGIDAS
router.post("/", authenticateToken, (req, res) =>
  productController.create(req, res)
);

router.put("/:id", authenticateToken, (req, res) =>
  productController.update(req, res)
);

router.delete("/:id", authenticateToken, (req, res) =>
  productController.delete(req, res)
);

export default router;
