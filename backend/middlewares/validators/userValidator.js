const { body } = require('express-validator');
const { User } = require('../../models');

exports.registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),

  body('username')
    .notEmpty().withMessage('Username is required')
    .custom(async (value) => {
      const user = await User.findOne({ where: { username: value } });
      if (user) throw new Error('Username already in use');
      return true;
    }),

  body('email')
    .isEmail().withMessage('Valid email is required')
    .custom(async (value) => {
      const user = await User.findOne({ where: { email: value } });
      if (user) throw new Error('Email already registered');
      return true;
    }),

  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

  body('role')
    .optional()
    .isIn(['admin', 'cashier']).withMessage('Invalid role'),
];

exports.updateValidation = [
  body('username')
    .optional()
    .notEmpty().withMessage('Username is required')
    .custom(async (value, { req }) => {
      const user = await User.findOne({ where: { username: value } });
      if (user && user.id !== req.params.id) {
        throw new Error('Username already in use');
      }
      return true;
    }),

  body('email')
    .optional()
    .isEmail().withMessage('Valid email is required')
    .custom(async (value, { req }) => {
      const user = await User.findOne({ where: { email: value } });
      if (user && user.id !== req.params.id) {
        throw new Error('Email already registered');
      }
      return true;
    }),

  body('role')
    .optional()
    .isIn(['admin', 'cashier']).withMessage('Invalid role'),
];


exports.loginValidation = [
  body('email').isEmail().withMessage('Email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];
