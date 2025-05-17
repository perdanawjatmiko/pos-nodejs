const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate, authorize } = require("../middlewares/authMiddleware");
const { productValidation, updateValidation } = require('../middlewares/validators/productValidator');
const validate = require('../middlewares/validateResult');
// const upload = require('../middlewares/uploadMiddleware');
const {uploadProduct} = require('../middlewares/uploadMiddleware');

router.get('/', authenticate, productController.getAll);
router.get('/:id', authenticate, productController.getOne);
router.post('/', authenticate, authorize(["admin", "owner"]), uploadProduct.single('image'), productValidation, validate, productController.create);
router.put('/:id', authenticate, authorize(["admin", "owner"]), uploadProduct.single('image'), updateValidation,  validate, productController.update);
router.delete('/:id', authenticate, authorize(["admin", "owner"]), productController.destroy);

module.exports = router;
