const express = require("express");
const router = express.Router();

require("../db");
router.use("/auth", require("../routes/auth"));
router.use("/lotto", require("../routes/lotto"));


module.exports = router