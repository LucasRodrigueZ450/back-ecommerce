import { Router } from "express";
import paymentController from "../controllers/paymentController.js";
import authenticateToken from "../middleware/auth.js";

const router = Router();

// Processar pagamento
router.post("/process", authenticateToken, (req, res) =>
  paymentController.processPayment(req, res)
);

// Webhook
router.post("/webhook", (req, res) =>
  paymentController.webhook(req, res)
);

export default router;
