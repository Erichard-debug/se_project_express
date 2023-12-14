const express = require("express");

const router = express.Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const { validateUpdate } = require("../middlewares/validation");
const { authorize } = require("../middlewares/auth");

router.get("/me",authorize, getCurrentUser);
router.patch("/me",authorize,validateUpdate, updateProfile);

module.exports = router;
