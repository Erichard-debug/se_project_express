const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OK, UNAUTHORIZED, CREATED } = require("../utils/errors");
const { handleUserHttpError } = require("../utils/errorHandlers");
const { JWT_SECRET } = require("../utils/config");

function login(req, res) {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("incorrect username or password"));
      }

      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.send({ token });
    })
    .catch((err) => {
      res.status(UNAUTHORIZED).send({ message: err.message });
    });
}

function createUser(req, res) {
  const { name, avatar, email, password } = req.body;

  if (!email) {
    res.status(400).send({ message: "Please include an email" });
    return;
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        const error = new Error("a user with that email already exists.");
        error.statusCode = 409;
        return Promise.reject(error);
      }

      bcrypt.hash(password, 10).then((hash) => {
        User.create({ name, avatar, email, password: hash })
          .then((user) => {
            res.status(CREATED).send({
              name: user.name,
              email: user.email,
              avatar: user.avatar,
            });
          })
          .catch((err) => {
            handleUserHttpError(req, res, err);
          });
      });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(err.statusCode || 500)
        .send({ message: err.message || "Internal server error" });
    });
}

function getUsers(req, res) {
  User.findById(req.params.id)
    .orFail()
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
function getCurrentUser(req, res) {
  User.findById(req.user._id)
    .orFail()
    .then((user) => {
      res.status(OK).send(user);
    })
    .catch((err) => {
      handleUserHttpError(req, res, err);
    });
}

function updateProfile(req, res) {
  User.findOneAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  })
    .orFail()
    .then((user) => {
      res.status(OK).send({ user });
    })
    .catch((err) => {
      handleUserHttpError(req, res, err);
    });
}

module.exports = {
  createUser,
  getUsers,
  getUser,
  login,
  getCurrentUser,
  updateProfile,
};
