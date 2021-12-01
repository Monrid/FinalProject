const express = require("express");
const router = express.Router();
const Lotto = require("../controllers/lottocontroller");

router.post("/createlotto", Lotto.createlotto);

module.exports = router