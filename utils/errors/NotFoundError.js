module.exports = class NotFoundError extends Error {
  constructor(message) {
    super(message || "Resource not found!");
    this.status = 404;
    this.name = "NotFoundError";
  }
};