const clothingItems = require("../models/clothingItem");
const { OK, CREATED } = require("../utils/errors");
const { handleItemHttpError } = require("../utils/errorHandlers");

function getItems(req, res) {
  clothingItems
    .find({})
    .then((items) => {
      res.status(OK).send(items);
    })
    .catch((err) => {
      handleItemHttpError(req, res, err);
    });
}

function createItem(req, res) {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  clothingItems
    .create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(CREATED).send({ data: item });
    })
    .catch((err) => {
      handleItemHttpError(req, res, err);
    });
}

function deleteItem(req, res) {
  clothingItems
    .findByIdAndRemove(req.params.itemId)
    .orFail()
    .then((item) => {
      res.status(OK).send(item);
    })
    .catch((err) => {
      handleItemHttpError(req, res, err);
    });
}

function likeItem(req, res) {
  clothingItems
    .findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .orFail()
    .then((like) => {
      res.status(OK).send(like);
    })
    .catch((err) => {
      handleItemHttpError(req, res, err);
    });
}

function dislikeItem(req, res) {
  clothingItems
    .findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .orFail()
    .then((dislike) => {
      res.status(OK).send(dislike);
    })
    .catch((err) => {
      handleItemHttpError(req, res, err);
    });
}

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
