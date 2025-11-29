// src/services/paymentService.js
import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import { MP_ACCESS_TOKEN } from "../config/env.js";
import Order from "../models/order.js";

class PaymentService {
  constructor() {
    this.client = new MercadoPagoConfig({
      accessToken: MP_ACCESS_TOKEN,
    });

    this.preference = new Preference(this.client);
    this.payment = new Payment(this.client);
  }

  async createPayment({ items, userId, payerEmail, shippingCost = 0 }) {
    if (!userId) throw new Error("userId é obrigatório");
    if (!items || !items.length) throw new Error("Carrinho vazio");

    // URL real do front em produção (sem barra no fim!)
    const FRONT_URL = "https://front-ecommerce-bay.vercel.app";

    // Webhook do backend (Render)
    const WEBHOOK_URL =
      "https://back-ecommerce-7cp3.onrender.com/api/payment/webhook";

    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );

    const total = subtotal + Number(shippingCost || 0);

    // Criar pedido no banco
    const order = await Order.create({
      userId,
      items: items.map((item) => ({
        productId: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total,
      status: "pending",
      paymentId: null,
      preferenceId: null,
      date: new Date(),
    });

    const preferenceBody = {
      items: items.map((item) => ({
        id: item._id,
        title: item.name,
        unit_price: Number(item.price),
        quantity: Number(item.quantity),
      })),

      // Rota única para qualquer status de pagamento
      back_urls: {
        success: `${FRONT_URL}/payment-status?status=approved&orderId=${order._id}`,
        failure: `${FRONT_URL}/payment-status?status=rejected&orderId=${order._id}`,
        pending: `${FRONT_URL}/payment-status?status=pending&orderId=${order._id}`,
      },

      redirect_urls: {
        success: `${FRONT_URL}/payment-status?status=approved&orderId=${order._id}`,
        failure: `${FRONT_URL}/payment-status?status=rejected&orderId=${order._id}`,
        pending: `${FRONT_URL}/payment-status?status=pending&orderId=${order._id}`,
      },

      // Agora funciona tanto no Pix quanto no cartão
      auto_return: "approved",

      external_reference: order._id.toString(),
      notification_url: WEBHOOK_URL,
    };

    const response = await this.preference.create({ body: preferenceBody });

    order.preferenceId = response.id;
    await order.save();

    return {
      id: response.id,
      init_point: response.init_point,
      orderId: order._id,
      total,
    };
  }

  async handleWebhook(payload) {
    console.log("📩 Webhook recebido:", JSON.stringify(payload, null, 2));

    const { type, data } = payload;

    if (type !== "payment") return;

    const paymentId = data.id;
    if (!paymentId) return;

    const paymentResponse = await this.payment.get({ id: paymentId });
    const mp = paymentResponse.body || paymentResponse;

    const { status, external_reference } = mp;

    console.log("💳 Pagamento:", { paymentId, status, external_reference });

    const order = await Order.findByIdAndUpdate(
      external_reference,
      { status, paymentId },
      { new: true }
    );

    if (order) {
      console.log("✅ Pedido atualizado:", order._id);
    }
  }
}

export default new PaymentService();
