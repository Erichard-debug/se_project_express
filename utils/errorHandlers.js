const {
  NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
} = require("./errors");

function handleUserHttpError(req, res, err) {
  console.error(err);
  switch (err.name) {
    case "DocumentNotFoundError":
      res
        .status(NOT_FOUND)
        .send({ message: `user id ${req.params.id} couldn't be found` });
      break;
    case "CastError":
      res.status(BAD_REQUEST).send({ message: "id is incorrect format" });
      break;
    case "ValidationError":
      res
        .status(BAD_REQUEST)
        .send({ message: "id is incorrect format or information is missing" });
      break;
    default:
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: `An ${err.name} error has occurred on the server` });
      break;
  }
}

function handleItemHttpError(req, res, err) {
  console.error(err);
  switch (err.name) {
    case "DocumentNotFoundError":
      res
        .status(NOT_FOUND)
        .send({ message: `item id ${req.params.itemId} couldn't be found` });
      break;
    case "CastError":
      res.status(BAD_REQUEST).send({ message: "id is incorrect format" });
      break;
    case "ValidationError":
      res
        .status(BAD_REQUEST)
        .send({ message: "id is incorrect format, or information is missing" });
      break;
    case "Unauthorized":
      res.status(UNAUTHORIZED).send({ message: "Request is unauthorized" });
      break;
    default:
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
      break;
  }
}
module.exports = {
  handleUserHttpError,
  handleItemHttpError,
};
