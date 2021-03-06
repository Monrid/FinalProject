const express = require("express");
const router = express.Router();
const Lotto = require("../controllers/lottocontroller");
const jwt = require("../jwt");

router.post("/create", Lotto.createlotto);
router.post("/buy", jwt.verify, Lotto.buylotto);
router.get("/get/available", jwt.verify, Lotto.getlottoAvailable);
router.get("/get/all", jwt.verify, Lotto.getAll);
router.post("/check", jwt.verify, Lotto.check);
router.get("/history", jwt.verify, Lotto.gethistory);

module.exports = router