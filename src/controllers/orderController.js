// src/controllers/orderController.js
import orderService from "../services/orderService.js";

class OrderController {
  // ----------------------------------------
  // Criar pedido
  // ----------------------------------------
  async create(req, res) {
    try {
      const userId =
        req.user?.id || req.user?._id || req.user?.userId;

      if (!userId) {
        return res.status(400).json({ error: "Usuário não identificado." });
      }

      const order = await orderService.create({
        userId,
        ...req.body,
      });

      return res.status(201).json(order);
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      return res.status(500).json({ error: "Erro ao criar pedido" });
    }
  }

  // ----------------------------------------
  // Retorna pedidos do usuário logado
  // ----------------------------------------
  async getMyOrders(req, res) {
    try {
      const userId =
        req.user?.id || req.user?._id || req.user?.userId;

      if (!userId) {
        return res.status(400).json({ error: "Usuário não identificado." });
      }

      const orders = await orderService.getByUser(userId);
      return res.json(orders);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      return res.status(500).json({ error: "Erro ao buscar pedidos" });
    }
  }

  // ----------------------------------------
  // Atualiza o último pedido após pagamento
  // Chamado pelo PaymentStatus.jsx
  // ----------------------------------------
  async updatePaymentInfo(req, res) {
    try {
      const userId =
        req.user?.id || req.user?._id || req.user?.userId;

      if (!userId) {
        return res.status(400).json({ error: "Usuário não identificado." });
      }

      const { status, paymentId, preferenceId } = req.body;

      if (!status) {
        return res.status(400).json({ error: "Status é obrigatório." });
      }

      const order = await orderService.updateLastOrderStatus({
        userId,
        status,
        paymentId,
        preferenceId,
      });

      return res.json({
        success: true,
        updated: order,
      });
    } catch (error) {
      console.error("Erro ao atualizar info de pagamento:", error);
      return res.status(500).json({ error: "Erro ao atualizar pedido" });
    }
  }
}

export default new OrderController();
