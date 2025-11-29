// src/models/Product.js
import mongoose from "mongoose";

// Função para Title Case
function toTitleCase(str) {
  if (!str) return "";
  return str.replace(/\w\S*/g, (txt) =>
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

// Função para normalizar preço
function normalizePrice(value) {
  if (typeof value === "string") {
    return Number(value.replace(/\./g, "").replace(",", "."));
  }
  return value;
}

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: [0, "O preço não pode ser negativo"],
    set: normalizePrice
  },
  category: {
    type: String,
    required: true,
    trim: true,
    set: toTitleCase
  },
  image: {
    type: String,
    default: "https://via.placeholder.com/150",
    validate: {
      validator(v) {
        return /^https?:\/\/.+/i.test(v);
      },
      message: "URL da imagem inválida"
    }
  },
  stock: {
    type: Number,
    required: true,
    min: [0, "Estoque não pode ser negativo"],
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Não recriar modelo caso exista
export default mongoose.models.Product || mongoose.model("Product", productSchema);
