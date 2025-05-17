const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticate, authorize } = require("../middlewares/authMiddleware");
const { categoryValidation } = require('../middlewares/validators/categoryValidator');
const validate = require('../middlewares/validateResult');

router.get('/', authenticate, categoryController.getAll);
router.post('/', authenticate, categoryValidation, validate, authorize(["admin", "owner"]), categoryController.create);
router.put('/:slug', authenticate, categoryValidation, validate, authorize(["admin", "owner"]), categoryController.update);
router.delete('/:id', authenticate, authorize(["admin", "owner"]), categoryController.destroy);
router.get('/:slug', authenticate, categoryController.getBySlug);

module.exports = router;
