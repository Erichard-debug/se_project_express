module.exports = function errorHandler(err, req, res, next) {
  if (err instanceof Error) {
    return res
      .status(err.status || 500)
      .send({ name: err.name, message: err.message });
  }
  return res.status(500).send({
    name: "UnknownError",
    message: "An unexpected server error occurred.",
  });
};