module.exports = class BadRequestError extends Error {
  constructor(message) {
    super(message || "Invalid data provided.");
    this.status = 400;
    this.name = "BadRequestError";
  }
};