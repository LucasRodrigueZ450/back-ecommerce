import paymentService from "../services/paymentService.js";

class PaymentController {
  async processPayment(req, res) {
    try {
      const { items, payerEmail, shippingCost } = req.body;

      // 🔥 tentar pegar todas as possibilidades que o JWT pode ter
      const userId =
        req.user?.id ||
        req.user?.userId ||
        req.user?._id;

      if (!userId) {
        console.error("❌ JWT sem userId/id/_id:", req.user);
        return res.status(400).json({ error: "Token inválido: userId ausente" });
      }

      const result = await paymentService.createPayment({
        items,
        userId,
        payerEmail,
        shippingCost,
      });

      return res.json(result);

    } catch (error) {
      console.error("❌ Erro ao processar pagamento:", error);
      return res.status(500).json({
        error: "Erro ao processar pagamento",
        details: error.message,
      });
    }
  }

  async webhook(req, res) {
    try {
      await paymentService.handleWebhook(req.body);
      return res.status(200).send("OK");
    } catch (error) {
      console.error("❌ Erro no webhook:", error);
      return res.status(500).send("Erro");
    }
  }
}

export default new PaymentController();
