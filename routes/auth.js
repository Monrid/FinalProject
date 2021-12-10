const express = require("express");
const router = express.Router();
const Authen = require("../controllers/authencontroller");
const jwt = require("../jwt");

router.post("/register", Authen.register); 
router.post("/login", Authen.login);
router.post("/currentuser", jwt.verify, Authen.currentUser);

module.exports = router