module.exports = class ConflictError extends Error {
  constructor(message) {
    super(message || "Resource already exists.");
    this.status = 409;
    this.name = "ConflictError";
  }
};