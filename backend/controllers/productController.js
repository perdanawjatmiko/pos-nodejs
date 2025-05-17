const { Product, Category } = require('../models');
const fs = require('fs');
const path = require('path');
const { where } = require('sequelize');
const slugify = require('slugify');

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

  async getBySlug(req, res) {
    try {
      const {slug} = req.params;
      const product = await Product.findOne({
        where: {slug: slug},
        include: [{
          association: "category"
        }]
      })
      if (!product) return res.status(404).json({ message: 'Product not found' });
      res.json(product);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
  try {
    const {
      name,
      price,
      stock,
      category_id,
      barcode,
      description,
      is_discount,
      discount_price
    } = req.body;

    const image = req.file ? `products/${req.file.filename}` : null;
    const slug = slugify(name, { lower: true, strict: true });

    const newProduct = await Product.create({
      name,
      slug,
      barcode,
      description,
      price,
      is_discount,
      discount_price,
      stock,
      image,
      category_id
    });

    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  },

  async update(req, res) {
  try {
    const {
      name,
      price,
      stock,
      category_id,
      barcode,
      description,
      is_discount,
      discount_price
    } = req.body;

    const product = await Product.findOne({ where: { slug: req.params.slug } });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (req.file && product.image) {
      const oldPath = path.join(__dirname, '../uploads', product.image);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const newImage = req.file ? `products/${req.file.filename}` : product.image;
    const slug = name ? slugify(name, { lower: true, strict: true }) : product.slug;

    await product.update({
      name,
      slug,
      barcode,
      description,
      price,
      is_discount,
      discount_price,
      stock,
      category_id,
      image: newImage
    });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
},

  async destroy(req, res) {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });

      if (product.image) {
        const imagePath = path.join(__dirname, '..', 'uploads', product.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      await product.destroy();
      res.json({ message: 'Product deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
