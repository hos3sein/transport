const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const fetch = require("node-fetch");
const Transport = require("../models/Transport");
const Inquiry = require("../models/Inquiry");
const Group = require("../models/Group");


// const Sales = require("../models/Sales");

exports.createPerm = asyncHandler(async (req, res, next) => {

  const { data } = req.body;
  try {
    
    const urll = `${process.env.SERVICE_SETTING}/api/v1/setting/dev/createperm`;
    const rawResponse = await fetch(urll, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const response = await rawResponse.json();
    if (response.success) {
      res.status(200).json({
        success: true,
        data: {},
      });
    }
  } catch (err) {

    console.log("err", err);
    
  }
});

exports.delAll = asyncHandler(async (req, res, next) => {
  await Transport.remove();
  await Inquiry.remove();
  res.status(200).json({
    success: true,
    dta: {},
  });
});

exports.all = asyncHandler(async (req, res, next) => {
  const all = await Transport.find();
  const all2 = await Inquiry.find();
  res.status(200).json({
    success: true,
    dta: { TTTTTTT: all, IIIIIIIIIIII: all2 },
  });
});

exports.update = asyncHandler(async (req, res, next) => {
  const { user, id, contract, status } = req.body;
  const all = await Inquiry.findByIdAndUpdate(
    id,
    {
      contract,
      status,
    },
    { strict: false }
  );
  // await Inquiry.remove();
  res.status(200).json({
    success: true,
    dta: all,
  });
});
