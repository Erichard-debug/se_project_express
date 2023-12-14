const router = require("express").Router();
const { authorize } = require("../middlewares/auth");
const {
  validateClothingItem,
  validateIds,
} = require("../middlewares/validation");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

router.post("/", authorize,validateClothingItem, createItem);
router.get("/", getItems);
router.delete("/:itemId", authorize,validateIds, deleteItem);
router.put("/:itemId/likes", authorize,validateIds, likeItem);
router.delete("/:itemId/likes", authorize,validateIds, dislikeItem);

module.exports = router;
