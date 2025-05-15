const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticate, authorize } = require("../middlewares/authMiddleware");

router.get('/', authenticate, categoryController.getAll);
router.post('/', authenticate, authorize(["admin", "owner"]), categoryController.create);
router.put('/:id', authenticate, authorize(["admin", "owner"]), categoryController.update);
router.delete('/:id', authenticate, authorize(["admin", "owner"]), categoryController.destroy);
router.get('/:slug', authenticate, categoryController.getBySlug);

module.exports = router;
