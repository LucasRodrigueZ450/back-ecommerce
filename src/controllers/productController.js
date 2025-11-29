// src/controllers/productController.js
import productService from "../services/productService.js";

class ProductController {

  async getAll(req, res) {
    try {
      const products = await productService.getAll();
      res.json(products);
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const product = await productService.getById(req.params.id);
      res.json(product);
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      const product = await productService.create(req.body);
      res.status(201).json({
        message: "Produto criado com sucesso",
        product,
      });
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const updated = await productService.update(req.params.id, req.body);

      res.json({
        message: "Produto atualizado com sucesso",
        product: updated,
      });
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const deleted = await productService.delete(req.params.id);

      res.json({
        message: "Produto excluído com sucesso",
        product: deleted,
      });
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }
}

export default new ProductController();
