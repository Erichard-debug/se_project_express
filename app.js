require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const errorHandler = require("./middlewares/error-handler");

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://www.expresswtwr.twilightparadox.com",
    "http://expresswtwr.twilightparadox.com",
    "https://www.expresswtwr.twilightparadox.com",
    "https://expresswtwr.twilightparadox.com",
  ],
};

const { PORT = 3001 } = process.env;
const app = express();
mongoose.connect(
  "mongodb://127.0.0.1:27017/wtwr_db",
  (r) => {
    console.log("Connected to DB", r);
  },
  (e) => console.log("DB error", e),
);

const routes = require("./routes/index");

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.use(requestLogger);
app.use(express.json());
app.use(cors(corsOptions));
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
