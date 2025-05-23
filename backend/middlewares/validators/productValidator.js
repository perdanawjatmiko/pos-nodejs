const { body } = require('express-validator');
const { Category, Product } = require('../../models');

exports.productValidation = [
  body('name').notEmpty().withMessage('Product name is required'),

  body('price')
    .isNumeric().withMessage('Price must be a number'),

  body('stock')
    .isInt({ min: 0 }).withMessage('Stock must be a positive integer'),

  body('categoryId')
    .optional()
    .isUUID().withMessage('Category ID must be a valid UUID')
    .custom(async (value) => {
      const category = await Category.findByPk(value);
      if (!category) throw new Error('Category not found');
      return true;
    }),
];

exports.updateValidation = [
  body('name')
    .optional()
    .notEmpty().withMessage('Product name is required'),

  body('price')
    .optional()
    .isNumeric().withMessage('Price must be a number'),

  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock must be a positive integer'),

  body('categoryId')
    .optional()
    .isUUID().withMessage('Category ID must be a valid UUID')
    .custom(async (value) => {
      const category = await Category.findByPk(value);
      if (!category) throw new Error('Category not found');
      return true;
    }),
];
