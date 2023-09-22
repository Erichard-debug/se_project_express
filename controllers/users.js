const User = require("../models/user");
const { OK } = require("../utils/errors");
const { handleUserHttpError } = require("../utils/errorHandlers");

function createUser(req, res) {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      handleUserHttpError(req, res, err);
    });
}

function getUsers(req, res) {
  User.find({})
    .then((users) => {
      res.status(OK).send(users);
    })
    .catch((err) => {
      handleUserHttpError(req, res, err);
    });
}

function getUser(req, res) {
  User.findById(req.params.id)
    .orFail()
    .then((user) => {
      res.status(OK).send(user);
    })
    .catch((err) => {
      handleUserHttpError(req, res, err);
    });
}

module.exports = {
  createUser,
  getUsers,
  getUser,
};
