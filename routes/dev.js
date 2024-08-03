const express = require("express");

const C = require("../controllers/dev");

const router = express.Router();

// POST
router.post("/createperm", C.createPerm);

router.get("/dellall", C.delAll);

router.get("/all", C.all);
router.post("/up/:id/:status", C.update);

module.exports = router;
