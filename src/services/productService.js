// src/services/productService.js
import Product from "../models/product.js";
import mongoose from "mongoose";

class ProductService {

  async getAll() {
    return await Product.find({ active: true });
  }

  async getById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw { status: 400, message: "ID do produto inválido" };
    }

    const product = await Product.findById(id);
    if (!product) {
      throw { status: 404, message: "Produto não encontrado" };
    }

    return product;
  }

  async create(data) {
    const { name, description, price, category, image, stock } = data;

    if (!name || !description || !price || !category) {
      throw { status: 400, message: "Campos obrigatórios faltando" };
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      image: image || "https://via.placeholder.com/150",
      stock: stock || 0,
    });

    await product.save();
    return product;
  }

  async update(id, data) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw { status: 400, message: "ID do produto inválido" };
    }

    const updated = await Product.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );

    if (!updated) {
      throw { status: 404, message: "Produto não encontrado" };
    }

    return updated;
  }

  async delete(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw { status: 400, message: "ID do produto inválido" };
    }

    const product = await Product.findById(id);
    if (!product) {
      throw { status: 404, message: "Produto não encontrado" };
    }

    // delete lógico
    product.active = false;
    await product.save();

    return product;
  }
}

export default new ProductService();
