// src/models/Order.js
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  items: {
    type: Array,
    required: true
  },

  total: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: ["approved", "pending", "rejected"],
    required: true
  },

  paymentId: {
    type: String
  },

  preferenceId: {
    type: String
  },

  date: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Order", OrderSchema);
