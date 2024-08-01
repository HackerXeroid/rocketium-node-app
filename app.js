const express = require("express");
const dotenv = require("dotenv");
const userRouter = require("./routes/userRoutes");
const { notFoundHandler } = require("./middlewares/errorHandler.js");

const app = express();
dotenv.config();

app.use('/api/v1/users', userRouter);

// Error middleware incase the route is undefined.
app.use(notFoundHandler);
module.exports = app;