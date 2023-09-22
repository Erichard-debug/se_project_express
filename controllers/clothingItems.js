const clothingItems = require("../models/clothingItem");
const { OK, CREATED } = require("../utils/errors");
const { handleItemHttpError } = require("../utils/errorHandlers");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  console.log(name, weather, imageUrl);
  clothingItems
    .create({ name, weather, imageUrl })
    .then((item) => {
      res.status(CREATED).send({ data: item });
    })
    .catch((err) => {
      handleItemHttpError(req, res, err);
    });
};

const getItems = (req, res) => {
  clothingItems
    .find({})
    .then((items) => res.status(OK).send(items))
    .catch((err) => {
      handleItemHttpError(req, res, err);
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageURL } = req.body;

  clothingItems
    .findByIdAndUpdate(itemId, { $set: { imageURL } })
    .orFail()
    .then((item) => res.status(OK).send({ data: item }))
    .catch((err) => {
      handleItemHttpError(req, res, err);
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  clothingItems
    .findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(OK).send(item))
    .catch((err) => {
      handleItemHttpError(req, res, err);
    });
};

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
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
