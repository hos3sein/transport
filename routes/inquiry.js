const express = require("express");

const C = require("../controllers/inquiry");

const { protect } = require("../middleware/auth");

const router = express.Router();

// POST
// router.get("/offerprice/:id/:price", protect, C.offerPrice);

//createInquery

router.post("/createinquiry",protect,C.requiestInquiryPrice);

router.post("/msg/:id",protect,C.msg);

// ! ok
//router.get("/offerprice/:id/:price", protect, C.offerPriceNew);
router.get("/offerprice/:id/:price", protect, C.offerPrice);

router.get("/getinfo", protect, C.getAllInfoForTransport);


router.get("/changestatus/:id", protect, C.changeStatus);
router.get("/changestatusadmin/:id/:type", protect, C.changeStatusAdmin);
// !ok
// TODO check she bussiness man bashe
// router.post("/inquiryprice", protect, C.requiestInquiryPrice);

// ! ok
router.get("/inquiryme", protect, C.inquiryMe);

router.get("/allshiping", protect, C.getAllShipping);
// ! ok
router.get("/inquirymeshipping", protect, C.inquiryMeShipping);

// ! ok
router.get("/allinquiry", protect, C.allInquiry);

// router.post("/approveoffer/:id/:userId", protect, C.approveOffer);

// ! ok



router.get("/approveoffer/:id/:userId", protect, C.approveOfferNew); //?approve Inquery  

router.get("/nologistic/:id", protect, C.logestic);  //?delete Inquery Logestic

router.get("/ongoing", protect, C.onGoing);

router.get("/offerme", protect, C.offerMe);


router.delete("/delteInqury/:id",protect,C.deleteInqury)
router.get("/cancel/:id", protect, C.cancel);

module.exports = router;
