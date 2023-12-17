const router = require("express").Router();
const clothingItem = require("./clothingItems");
const user = require("./users");
const NotFoundError = require("../utils/errors/NotFoundError")
const { login, createUser } = require("../controllers/users");
const { authorize } = require("../middlewares/auth");
const { validateUserInfo, validateAuth } = require("../middlewares/validation");

router.use("/users", authorize, user);
router.use("/items", clothingItem);

router.post("/signin",validateAuth, login);
router.post("/signup",validateUserInfo, createUser);

router.use((req, res, next) => {
  next(new NotFoundError("Router resource not found."));
});

module.exports = router;
