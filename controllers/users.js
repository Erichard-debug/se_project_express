const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const BadRequestError = require("../utils/errors/BadRequestError");
const NotFoundError = require("../utils/errors/NotFoundError");
const ConflictError = require("../utils/errors/ConflictError");
const UnauthorizedError = require("../utils/errors/UnauthorizedError");

function login(req, res, next) {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new Error("incorrect username or password");
      }

      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.send({ token });
    })
    .catch(() => next(new UnauthorizedError()));
}

// function createUser(req, res, next) {
//   const { name, avatar, email, password } = req.body;

//   if (!email) {
//     return next(new BadRequestError());
//   }

//   User.findOne({ email }).then((existingUser) => {
//     if (existingUser) {
//       return next(new ConflictError("Email already exists."));
//     }

//     bcrypt.hash(password, 10).then((hash) => {
//       User.create({ name, avatar, email, password: hash })
//         .then((user) => {
//           res.send({
//             name: user.name,
//             email: user.email,
//             avatar: user.avatar,
//           });
//         })
//         .catch((err) => {
//           next(err);
//         });
//     });
//   });
// }
const createUser = async (req, res, next) => {
  try {
    const { name, avatar, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      name,
      email,
      password: hashedPassword,
      avatar: avatar || undefined,
    };

    return User.create(userData)
      .then((user) => {
        const userObj = user.toObject();
        delete userObj.password;
        res.status(200).send(userObj);
      })
      .catch((err) => {
        if (err.code === 11000) {
          return next(new ConflictError("Email already exists."));
        }
        if (err.name === "ValidationError") {
          return next(new BadRequestError());
        }
        return next(err);
      });
  } catch (err) {
    return next(err);
  }
};

function getCurrentUser(req, res, next) {
  User.findById(req.user._id)
    .orFail(() => new NotFoundError("Item not found."))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => next(err));
}

function updateProfile(req, res, next) {
  User.findOneAndUpdate({ _id: req.user._id }, req.body, {
    new: true,
    runValidators: true,
  })
    .orFail(() => new NotFoundError("Item not found."))
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => next(err));
}

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};
