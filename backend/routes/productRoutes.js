const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate, authorize } = require("../middlewares/authMiddleware");

router.get('/', authenticate, productController.getAll);
router.get('/:id', authenticate, productController.getOne);
router.post('/', authenticate, authorize(["admin", "owner"]), productController.create);
router.put('/:id', authenticate, authorize(["admin", "owner"]), productController.update);
router.delete('/:id', authenticate, authorize(["admin", "owner"]), productController.destroy);

module.exports = router;
