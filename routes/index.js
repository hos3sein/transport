const express = require("express");
const router = express.Router();

//prefix router Dev
const inquiry = require("./inquiry");
router.use("/inquiry", inquiry);

//prefix router Dev
const dev = require("./dev");
router.use("/dev", dev);

const interservice = require("./interservice");
router.use("/interservice", interservice);

module.exports = router;
