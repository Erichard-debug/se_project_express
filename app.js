const express = require("express");

const cors = require("cors");

const mongoose = require("mongoose");

const { PORT = 3001 } = process.env;
const app = express();
mongoose.connect(
  "mongodb://127.0.0.1:27017/wrwt_db",
  (r) => {
    console.log("Connected to DB", r);
  },
  (e) => console.log("DB error", e),
);

const routes = require("./routes/index");

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: "650c8f6ded15aef466992a6d",
  };
  next();
});

app.use(routes);
app.use(cors());

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
