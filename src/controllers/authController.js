import authService from "../services/authService.js";

class AuthController {
  async register(req, res) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const result = await authService.login(req.body);
      return res.json(result);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }

  async processPayment(req, res) {
    try {
      const { items, payerEmail, shippingCost } = req.body;

      const userId = req.user.userId;
      if (!userId) {
        return res.status(400).json({ error: "Token inválido: userId ausente" });
      }

      const result = await paymentService.createPayment({
        items,
        userId,
        payerEmail,
        shippingCost,
      });

      res.json(result);
    } catch (error) {
      console.error("❌ Erro ao processar pagamento:", error);
      res.status(500).json({
        error: "Erro ao processar pagamento",
        details: error.message,
      });
    }
  }
}

export default new AuthController();
