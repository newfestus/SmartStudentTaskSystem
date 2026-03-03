const express = require("express");
const { getSummary } = require("../controllers/reportController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/summary", protect, getSummary);

module.exports = router;