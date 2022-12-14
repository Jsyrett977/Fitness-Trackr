require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const router = require("./api");

app.use(cors());
app.use(express.json());

const morgan = require("morgan");
app.use(morgan("dev"));

// Setup your Middleware and API Router here
app.get("/", function (req, res) {
  res.send({ msg: "Hello, I worked" });
});

app.use("/api", router);

// Catch-all route
app.use((req, res) => {
  res.status(404).send({ message: "Resource not found" });
});

// Error handling middleware
app.use((error, req, res, next) => {
  res.status(500).send({
    message: error.message,
    name: error.name,
    error: error.toString(),
  });
});

module.exports = app;
