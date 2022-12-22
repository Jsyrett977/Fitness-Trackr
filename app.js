require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const router = require("./api");


app.use(cors());
app.use(express.json());

const morgan = require("morgan");
app.use(morgan("dev"));

app.use("/api", router);

// Setup your Middleware and API Router here

// app.get("*", (req,res)=> {
//   res.status(404).send({
//     error: "404 not found",
//     message: "No root found for the requested URL"
// })
// })


app.use((error, req, res, next) => {
  console.error("Something went wrong", error)
  res.status(500).send({
    error: error.message,
    message: error.message,
    name: error.name
  })
})



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
