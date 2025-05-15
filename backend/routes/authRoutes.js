const router = require("express").Router();
const auth = require("../controllers/authController");
const { registerValidation, loginValidation } = require('../middlewares/validators/userValidator');
const validate = require('../middlewares/validateResult');

// router.post("/register", auth.register);
// router.post("/login", auth.login);
router.post('/register', registerValidation, validate, auth.register);
router.post('/login', loginValidation, validate, auth.login);

module.exports = router;
