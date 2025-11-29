import { Router } from "express";
import orderController from "../controllers/orderController.js";
import authenticateToken from "../middleware/auth.js";

const router = Router();

// Criar pedido (se quiser usar manualmente)
// router.post("/", authenticateToken, (req, res) =>
//   orderController.create(req, res)
// );

// 🔥 Pedidos do usuário logado
router.get("/my", authenticateToken, (req, res) =>
  orderController.getMyOrders(req, res)
);

// 🔥 Atualizar pedido após pagamento
router.put("/payment-update", authenticateToken, (req, res) =>
  orderController.updatePaymentInfo(req, res)
);

export default router;
