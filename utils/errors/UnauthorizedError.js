module.exports = class UnauthorizedError extends Error {
  constructor(message) {
    super(message || "Incorrect Email or Password.");
    this.status = 401;
    this.name = "UnauthorizedError";
  }
};