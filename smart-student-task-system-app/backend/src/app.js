const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => res.send("API running"));

app.use("/api/tasks", taskRoutes);

module.exports = app;
