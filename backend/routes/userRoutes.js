const router = require("express").Router();
const user = require("../controllers/userController");
const { authenticate, authorize } = require("../middlewares/authMiddleware");

router.get("/", authenticate, authorize(["admin", "owner", "kasir"]), user.getAll);
router.get("/:id", authenticate, authorize(["admin", "owner"]), user.getOne);
router.put("/:id", authenticate, authorize(["admin", "owner"]), user.update);
router.delete("/:id", authenticate, authorize(["admin"]), user.destroy);

module.exports = router;
