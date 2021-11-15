const express = require("express");
const router = express.Router();
const Authen = require("../controllers/authencontroller");

router.post("/register", Authen.register); 
router.post("/login", Authen.login);

module.exports = router