// src/services/orderService.js
import Order from "../models/order.js";

class OrderService {
  // Criar pedido
  async create(data) {
    const { userId, items, total, status, paymentId, preferenceId } = data;

    return await Order.create({
      userId,
      items,
      total,
      status: status || "pending",   // garante status
      paymentId: paymentId || null,
      preferenceId: preferenceId || null,
    });
  }

  // Pedidos do usuário logado
  async getByUser(userId) {
    return await Order.find({ userId }).sort({ createdAt: -1 });
  }

  // Atualizar último pedido
  async updateLastOrderStatus({ userId, status, paymentId, preferenceId }) {
    // Busca o último pedido criado
    const order = await Order.findOne({ userId }).sort({ createdAt: -1 });

    if (!order) return null;

    if (status) order.status = status;
    if (paymentId) order.paymentId = paymentId;
    if (preferenceId) order.preferenceId = preferenceId;

    await order.save();
    return order;
  }
}

export default new OrderService();
