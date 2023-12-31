const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const user = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "Wrong email format",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

user.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((users) => {
      if (!users) {
        return Promise.reject(new Error("Username or password are incorrect"));
      }

      return bcrypt.compare(password, users.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new Error("Username or password are incorrect"),
          );
        }

        return users;
      });
    });
};

module.exports = mongoose.model("user", user);
