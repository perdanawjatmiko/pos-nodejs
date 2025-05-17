const { Product, Category } = require('../models');
const fs = require('fs');
const path = require('path');

module.exports = {
  async getAll(req, res) {
    try {
      const products = await Product.findAll({ include: ['category'] });
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getOne(req, res) {
    try {
      const product = await Product.findByPk(req.params.id, { include: ['category'] });
      if (!product) return res.status(404).json({ message: 'Product not found' });
      res.json(product);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const { name, price, stock, category_id } = req.body;
      const image = req.file ? `products/${req.file.filename}` : null;

      const newProduct = await Product.create({ name, price, stock, image, category_id });
      res.status(201).json(newProduct);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const { name, price, stock, category_id } = req.body;
      
      const product = await Product.findByPk(req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });

      if (req.file && product.image) {
        const oldPath = path.join(__dirname, '../uploads', product.image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      const newImage = req.file ? req.file.filename : product.image;

      await product.update({ name, price, stock, category_id, image: newImage });
      res.json(product);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async destroy(req, res) {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });

      // Hapus gambar jika ada
      if (product.image) {
        const imagePath = path.join(__dirname, '..', 'uploads', product.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath); // atau gunakan fs.promises.unlink() untuk async
        }
        console.log(imagePath)
      }

      await product.destroy();
      res.json({ message: 'Product deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
