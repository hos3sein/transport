const express = require("express");

const C = require("../controllers/interservice");

const router = express.Router();

// POST
router.post("/createtransport", C.createTransport);

router.post("/changestatus", C.changeStatusInauiry);

router.post("/changestatuscommerce", C.changeSaleStatus);

router.post("/msg/:id", C.msg);

router.get("/find/:id/:user", C.find);

router.get("/findnew/:id/:user", C.find);

router.get("/findorder/:id/:price",C.findOrder)

router.get("/getinfoforchart",C.getInfoForChart)

router.get("/handeldelete/:id",C.handelDelete)

router.get("/inpection/:type/:id",C.inpection)

router.post("/handelCancel",C.handelCancelAfterContractWithoutTransport)

router.post("/cancelaftercontract",C.handelCancelAfterContractHaveTransport)



module.exports = router;
