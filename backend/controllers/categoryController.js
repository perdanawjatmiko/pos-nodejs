const { Category, Product } = require("../models");
const slugify = require("slugify");

module.exports = {
  // 🔍 Ambil semua kategori beserta produk-produknya
  async getAll(req, res) {
    try {
      const categories = await Category.findAll({ include: ["products"] });
      res.json(categories);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // 🔍 Ambil satu kategori berdasarkan ID (termasuk produk)
  async getOne(req, res) {
    try {
      const category = await Category.findByPk(req.params.id, {
        include: ["products"],
      });

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.json(category);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // 🔍 Ambil kategori berdasarkan slug + produk + pagination + sorting
  async getBySlug(req, res) {
    try {
      const { slug } = req.params;

      // Query params
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const sortBy = req.query.sortBy || "name";
      const sortOrder = req.query.sortOrder === "desc" ? "DESC" : "ASC";

      const category = await Category.findOne({
        where: { slug },
        attributes: ["id", "name", "slug"],
        include: [
          {
            association: "products",
            attributes: ["id", "name", "price", "stock"],
            order: [[sortBy, sortOrder]],
            separate: true, // agar pagination tidak mengganggu category
            offset,
            limit,
          },
        ],
      });

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.json({
        category: {
          id: category.id,
          name: category.name,
          slug: category.slug,
        },
        products: category.products,
        pagination: {
          page,
          limit,
          count: category.products.length,
        },
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // ➕ Tambah kategori baru
  async create(req, res) {
    try {
      const { name } = req.body;
      const slug = slugify(name, { lower: true });
      const newCategory = await Category.create({ name, slug });

      res.status(201).json(newCategory);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // ✏️ Update kategori
  async update(req, res) {
    try {
      const category = await Category.findOne({ where: { slug: req.params.slug } });
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      const { name } = req.body;
      const slug = slugify(name, { lower: true });
      await category.update({ name, slug });

      res.json(category);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // 🗑️ Hapus kategori
  async destroy(req, res) {
    try {
      const category = await Category.findByPk(req.params.id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      await category.destroy();
      res.json({ message: "Category deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
