const clothingItems = require("../models/clothingItem");
const BadRequestError = require("../utils/errors/BadRequestError");
const NotFoundError = require("../utils/errors/NotFoundError");
const ForbiddenError = require("../utils/errors/ForbiddenError");

function getItems(req, res, next) {
  clothingItems
    .find({})
    .then((items) => {
      res.send(items);
    })
    .catch((err) => next(err));
}

function createItem(req, res, next) {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  clothingItems
    .create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError());
      } else {
        next(err);
      }
    });
}

function deleteItem(req, res, next) {
  clothingItems
    .findById(req.params.itemId)
    .orFail(()=> new NotFoundError("Item not found."))
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        throw new ForbiddenError();
      }
      return item.deleteOne().then(() => res.send({ message: "Item deleted" }));
    })
    .catch((err) => {
      next(err);
    });
}

function likeItem(req, res, next) {
  clothingItems
    .findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .orFail(()=> new NotFoundError("Item not found."))
    .then((like) => {
      res.send(like);
    })
    .catch((err) => {
      next(err);
    });
}

function dislikeItem(req, res, next) {
  clothingItems
    .findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .orFail(()=> new NotFoundError("Item not found."))
    .then((dislike) => {
      res.send(dislike);
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
