const express = require("express");
const { signupStudent, loginStudent } = require("../controllers/studentController");

const router = express.Router();

router.post("/signup", signupStudent);
router.post("/login", loginStudent);

module.exports = router;
