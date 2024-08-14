const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const fetch = require("node-fetch");
const Transport = require("../models/Transport");
const Group = require("../models/Group");
const Inquiry = require("../models/Inquiry");
const {walletUpdater,walletUpdaterApp}=require("../utils/wallet")
const {pushNotificationStatic}=require("../utils/pushNotif")
const {
  createBuy,
  findSales,
  findCompany,
  pushNotification,
  notification,
  getAllVarible,
  changeTransportStatusForCommerce,
} = require("../utils/request");
const { refresh, refreshGT, refreshGC,SingleCommerceT,refreshchat,refresinq} = require("../utils/refresh");
const moment = require("moment");
const { response } = require("express");

exports.requiestInquiryPrice = asyncHandler(async (req, res, next) => {
  const { address, saleId } = req.body;
  console.log( 'chack address >>>>>>>>>>>',req.body)
  let requester
  let responser
// console.log("req.user._id", req.user._id);
//  const all=await Inquiry.find()
//   console.log("all",all);

  const check = await Inquiry.find({
    $and: [{ "requester._id": req.user._id },{ salse: saleId },{cancel:false}],
  });
   
  
  // console.log("check", check);

  if (check.length!=0) {
    return next(new ErrorResponse("you Already requsted", 401));
  }


  // console.log(">>>>>>>>>>>>>>>>>");

  // if (!grade || !quantity || !destination || !origin) {
  // }
  // return;

  const find = await findSales(saleId);
  console.log("nice");
  const allV= await getAllVarible()
  const comi=allV.getQuoteAmount
  const transportPaymnet=await walletUpdater(0,req.user._id,comi,"Get quote cost")
    if(!transportPaymnet.success){
      return next(new ErrorResponse("wallet section error",500))
    }
   const appPaymet=await walletUpdaterApp(1,req.user._id,comi,"Get quote cost")
    if(!appPaymet.success){
      return next(new ErrorResponse("wallet section error",500))
    }
  // const company = await Transport.findOne({
  //   "user._id": req.user._id,
  // });

  if (find.data) {
  
    

   if(find.data.type==0){
    const requesterBoss =await findCompany(req.user._id);
    console.log('requester data' , requesterBoss)

    const responserBoss=await findCompany(find.data.user._id);
    console.log('responser data' , responserBoss)
  
   

    requester = {
      _id: requesterBoss.data.user._id,
      idCompany: requesterBoss.data._id,
      profileCompany: requesterBoss.data.profileCompany,
      companyName: requesterBoss.data.companyName,
      username: requesterBoss.data.user.username,
      phone: requesterBoss.data.user.phone,
    };
    

    responser = {
      _id: responserBoss.data.user._id,
      idCompany: responserBoss.data._id,
      profileCompany: responserBoss.data.profileCompany,
      companyName: responserBoss.data.companyName,
      username: responserBoss.data.user.username,
      phone: responserBoss.data.user.phone,
    };
   




   }else{

    const requesterBoss =await findCompany(find.data.userTo._id);
    const responserBoss=await findCompany(find.data.user._id);
    requester = {
      _id: requesterBoss.data.user._id,
      idCompany: requesterBoss.data._id,
      profileCompany: requesterBoss.data.profileCompany,
      companyName: requesterBoss.data.companyName,
      username: requesterBoss.data.user.username,
      phone: requesterBoss.data.user.phone,
    };

    responser = {
      _id: responserBoss.data.user._id,
      idCompany: responserBoss.data._id,
      profileCompany: responserBoss.data.profileCompany,
      companyName: responserBoss.data.companyName,
      username: responserBoss.data.user.username,
      phone: responserBoss.data.user.phone,
    };
   }
    const result = await Inquiry.create({
      productType: find.data.productType,
      productName: find.data.productName,
      labReport: find.data.labReport,
      quantity: find.data.quantity,
      fineness: find.data.fineness,
      flashPoint: find.data.flashPoint,
      waterContent: find.data.waterContent,
      phoneNumber: find.data.phoneNumber,
      phoneNumberTo: find.data.phoneNumberTo,
      lineMaker: find.data.lineMaker,
      lineMakerTo: find.data.lineMakerTo,
      dateFrom: find.data.dateFrom,
      dateTo: find.data.dateTo,
      shipmentAmount: find.data.shipmentAmount,
      closingDate: find.data.closingDate,
      note: find.data.note,
      transportMethod: find.data.transportMethod,
      type: find.data.type,
      address: find.data.type == 0 ? find.data.address : address,
      addressTo: find.data.type == 1 ? find.data.addressTo : address,
      salse: saleId,
      requester: requester,
      responser:responser,
      status: 0,
      getQuotePaymnetInvoiceNumber:transportPaymnet.data
    });

    

    // refresh global vase hame transport ha
    // ! globalTransport
    // refresh alone be requester
    // ! refreshCommerce

    sender = {
      _id:requester._id,
      username:requester.username,
      pictureProfile:requester.pictureProfile,
    };
  
     recipient = {
      _id:requester._id,
      username:requester.username,
      pictureProfile:requester.pictureProfile,
    };
   
    // await pushNotification(
    //   "Inquery",
    //   "Quote Published",
    //   `Wating for Bid`,
    //   recipient,
    //   sender,
    //   "Transport",
    //   "Transport"
    // );
    // await notification(
    //   "Inquery",
    //   recipient,
    //   sender,
    //   saleId,
    //   "Transport",
    //   "Quote Published",
    //   `Wating for Bid`,
    // );

    await refreshGT();
    await SingleCommerceT(requester._id)

    res.status(200).json({
      success: true,
      data: {},
    });
  }
});

// elame gheymat az tarafe transport company
// ok
// ! GLOBAL REFRESH
exports.offerPrice=asyncHandler(async (req, res, next) => {
  const findCheck = await Inquiry.find({
    $and: [
      {
        bids: { $elemMatch: { userId: req.user._id } },
      },
      { _id: req.params.id },
    ],
  });

  if (findCheck.length) {
    return next(new ErrorResponse("you are before offer for inquiry", 401));
  }

  const find = await Inquiry.findById(req.params.id);
  
  
  // console.log("fiiiiiind", find);
  const findCompany = await Transport.findOne({ "user._id": req.user._id });
  // console.log("findCompany", findCompany);

   const data = {
    userId: req.user._id,
    idCompany: findCompany._id,
    username: req.user.username,
    profileCompany: findCompany.profileCompany,
    companyName: findCompany.companyName,
    phone: req.user.phone,
    bid: req.params.price,
  };

  const bid=(find.bid==0)?req.params.price:(find.bid>req.params.price)?req.params.price:find.bid //! agar 0 bood params.price agar nabood har kodoom kam tare

  const result = await Inquiry.findByIdAndUpdate(req.params.id, {
    $addToSet: { bids: data },
    bid
  });


 const sender = {
  _id:req.user._id,
  username:req.user.username,
  pictureProfile:req.user.pictureProfile,
  };

 const  recipient = {
    _id:find.requester._id,
    username:find.requester.username,
    pictureProfile:find.requester.pictureProfile,
  };
 
  pushNotificationStatic(recipient._id , 1)

  // refresh global vase hame transport ha
  // ! globalTransport
  await refreshGT();
  await SingleCommerceT(find.requester._id)
  // refresh alone be requester
  // ! refreshCommerce
  res.status(200).json({
    success: true,
    data: {},
  });
});

exports.offerPriceNew = asyncHandler(async (req, res, next) => { //!
  let sender;
  let recipient;
  const find = await Inquiry.findById(req.params.id);
  const user = await Transport.findOne({
    "user._id": req.user._id,
  });
  if (!find) {
    return next(new ErrorResponse("Inquiry not found", 404));
  }
  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }
  if (find.bids.length == 0) {
    const bid = {
      companyId: user._id,
      profileCompany: user.profileCompany,
      companyName: user.companyName,
      phone: req.user.phone,
      username: req.user.username,
      userId: req.user._id,
      bid: req.params.price,
      status: "waiting",
      at: moment(),
    };

    await Inquiry.findByIdAndUpdate(req.params.id, {
      $addToSet: { bids: bid },
      bid: req.params.price,
      minId: req.user._id,
      status: 1,
    });

    // sender = {
    //   _id: req.user._id,
    //   username: req.user.username,
    //   pictureProfile:req.user.pictureProfile,
    // };
    // console.log("im here>>>>>><<<<nice");
    // recipient = {
    //   _id:find.requster._id,
    //   username:find.requester.username,
    //   pictureProfile:find.requester.pictureProfile,
    // };
    // console.log("im here>>>>>><<<<<now");
    // await pushNotification(
    //   "bid price",
    //   "Some body bid to your order",
    //   "The bidder's bid was successful",
    //   recipient,
    //   sender,
    //   "commerceStack",
    //   "Order"
    // );
    pushNotificationStatic(recipient._id , 1)
    await refreshGT();
    await refreshGC();

    // await refresh(find.requester._id, "refreshCommerce");
    
    sender = {
      _id: req.user._id,
      username: req.user.username,
      pictureProfile: req.user.pictureProfile,
    };
  
     recipient = {
      _id: find.requester._id,
      username: find.requester.username,
      pictureProfile: find.requester.profileCompany,
    };
    // await pushNotification(
    //   "Inquery",
    //   "You get a bid !!!",
    //   `${sender.username} bid to your quote`,
    //   recipient,
    //   sender,
    //   "Transport",
    //   "Transport"
    // );
    // await notification(
    //   "Inquery",
    //   recipient,
    //   sender,
    //   saleId,
    //   "Transport",
    //   "Quote Published",
    //   `Wating for Bid`,
    // );

    return res.status(200).json({
      success: true,
      data: {},
    });
  } else {
    if (find.bid < req.params.price) {
      return res.status(200).json({
        success: true,
        data: "your bid must be lower than exist bid",
      });
    }

    const rejectUserId = find.minId;
    const rejectUser = await Transport.findOne({
      "user._id": rejectUserId,
    });

    await Inquiry.findOneAndUpdate(
      {
        _id: req.params.id,
        bids: {
          $elemMatch: { status: "waiting" },
        },
      },
      {
        $set: {
          "bids.$.status": "reject",
        },
      }
    );

    //  const rejectUserObj = {
    //     _id:rejectUser.user._id,
    //     username:rejectUser.user.username,
    //     pictureProfile:rejectUser.user.pictureProfile,
    //   };
    //   await pushNotification(
    //     "your offer rejected",
    //     "your offer rejected",
    //     "your offer rejected",
    //     rejectUserObj,
    //     rejectUserObj,
    //     "commerceStack",
    //     "Order"
    //   );
    await refreshGT();
    await refreshGC();


    const bid = {
      companyId: user._id,
      profileCompany: user.profileCompany,
      companyName: user.companyName,
      phone: req.user.phone,
      username: req.user.username,
      userId: req.user._id,
      bid: req.params.price,
      status: "waiting",
      at: moment(),
    };
    await Inquiry.findByIdAndUpdate(req.params.id, {
      $addToSet: { bids: bid },
      bid: req.params.price,
      minId: req.user._id,
      status: 1,
    });
    // sender = {
    //   _id: req.user._id,
    //   username: req.user.username,
    //   pictureProfile:req.user.pictureProfile,
    // };

    // recipient = {
    //   _id:find.requster._id,
    //   username:find.requester.username,
    //   pictureProfile:find.requester.pictureProfile,
    // };
    // await pushNotification(
    //   "bid price",
    //   "Some body bid to your order",
    //   "The bidder's bid was successful",
    //   recipient,
    //   sender,
    //   "commerceStack",
    //   "Order"
    // );
    pushNotificationStatic(recipient._id , 1)
    await refreshGT();
    await refreshGC();

    return res.status(201).json({
      success: true,
      data: {},
    });
  }

  // const findCheck = await Inquiry.find({
  //   $and: [
  //     {
  //       bids: { $elemMatch: { userId: req.user._id } },
  //     },
  //     { _id: req.params.id },
  //   ],
  // });

  // if (find.bids.length == 0) {
  //   // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
  //   const user = await Transport.findOne({
  //     "user._id": req.user._id,
  //   });

  //   const bid = {
  //     companyId: user._id,
  //     profileCompany: user.profileCompany,
  //     companyName: user.companyName,
  //     phone: req.user.phone,
  //     username: req.user.username,
  //     userId: req.user._id,
  //     bid: req.params.price,
  //     status: "waiting",
  //     at: moment(),
  //   };

  //   await Inquiry.findByIdAndUpdate(req.params.id, {
  //     $addToSet: { bids: bid },
  //     bid: req.params.price,
  //     minId: req.user._id,
  //     status: 1,
  //   });

  //   await refreshGT();
  //   // refresh alone be requester
  //   // ! refreshCommerce
  //   await refresh(find.requester._id, "refreshCommerce");

  //   return res.status(200).json({
  //     success: true,
  //     data: {},
  //   });
  // }

  // const min =
  //   find.bids.length &&
  //   find.bids.reduce((previous, current) => {
  //     return current.bid < previous.bid ? current : previous;
  //   });

  // // console.log("typeof min?????", min);
  // // console.log("???????????????????????????????????", req.user);
  // if (findCheck.length) {
  //   // console.log("2222222222222222222222222222222222");
  //   await Inquiry.updateMany(
  //     { _id: req.params.id, "bids.userId": req.user._id },
  //     {
  //       $set: {
  //         "bids.$.bid": req.params.price,
  //       },
  //       bid:
  //         typeof min == "undefined"
  //           ? req.params.price
  //           : find.bids.length == 1
  //           ? req.params.price
  //           : min.bid < req.params.price
  //           ? min.bid
  //           : req.params.price,
  //       minId:
  //         typeof min == "undefined"
  //           ? req.user._id
  //           : min.bid < req.params.price
  //           ? min.userId
  //           : req.user._id,
  //     },
  //     { new: true }
  //   );

  //   await refreshGT();
  //   // refresh alone be requester
  //   // ! refreshCommerce

  //   await refresh(find.requester._id, "refreshCommerce");

  //   return res.status(200).json({
  //     success: true,
  //     data: {},
  //   });
  // }

  // const user = await Transport.findOne({
  //   "user._id": req.user._id,
  // });

  // const bid = {
  //   companyId: user._id,
  //   profileCompany: user.profileCompany,
  //   companyName: user.companyName,
  //   phone: req.user.phone,
  //   username: req.user.username,
  //   userId: req.user._id,
  //   bid: req.params.price,
  //   status: "waiting",
  //   at: moment(),
  // };
  // // console.log("3333333333333333333333");
  // await Inquiry.findByIdAndUpdate(req.params.id, {
  //   $addToSet: { bids: bid },
  //   bid: min.bid < req.params.price ? min.bid : req.params.price,
  //   minId: min.bid < req.params.price ? min.userId : req.user._id,
  //   status: 1,
  // });

  // // ;vlld;vv;vsc

  // // await refreshGT();
  // // refresh alone be requester
  // // ! refreshCommerce
  // // await refresh(find.requester._id, "refreshCommerce");

  // await refreshGT();
  // // refresh alone be requester
  // // ! refreshCommerce

  // await refresh(find.requester._id, "refreshCommerce");

  // res.status(200).json({
  //   success: true,
  //   data: {},
  // });
});

// In baraye businessman vase darkhast gheymat
// ok

// darkhast gheymat hayee ke zadam
// ok
exports.inquiryMe = asyncHandler(async (req, res, next) => {
  const result = await Inquiry.find({
    $or: [{ "requester._id": req.user._id },{ "responser._id": req.user._id }],
  }).sort({
    createdAt: -1,
  });
  res.status(200).json({
    success: true,
    data: result,
  });
});

// inqury hayee ke transport tosh ghabol shode
exports.inquiryMeShipping = asyncHandler(async (req, res, next) => {
  const resultContract = await Inquiry.find({$and:[
    {minId: req.user._id},
    {cancel:false}
  ]}).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: resultContract,
  });
});

// darkhast gheymat hayee ke zadam
// ok
exports.allInquiry = asyncHandler(async (req, res, next) => {
  const result = await Inquiry.find({
  }).sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    data: result,
  });
});

// elam gheymati ke dadam
// ok
exports.offerMe = asyncHandler(async (req, res, next) => {
  const result = await Inquiry.find({
    bids: { $elemMatch: { userId: req.user._id } },
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: result,
  });
});

exports.onGoing = asyncHandler(async (req, res, next) => {
  const result = await Inquiry.find({
    $and: [{ bids: { $elemMatch: { userId: req.user._id } } }, { status: 1 }],
  });

  res.status(200).json({
    success: true,
    data: result,
  });
});
exports.getAllShipping = asyncHandler(async (req, res, next) => {
  const allTransport = await Transport.find();

  res.status(200).json({
    success: true,
    data: allTransport,
  });
});

exports.deleteInqury = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const isAdmin = user.group.includes("admin");
  const isSuperAdmin = user.group.includes("superAdmin");
  if (!isAdmin && !isSuperAdmin) {
    return next(new ErrorResponse("you dont have access to this route ", 401));
  }
  const id = req.params.id;
  await Inquiry.findByIdAndRemove(id);
  res.status(200).json({
    success: true,
    data: {},
  });
});

exports.cancel = asyncHandler(async (req, res, next) => {
  const inquery=await Inquiry.findByIdAndUpdate(req.params.id,{
    cancel:true,
  })
  
  await pushNotificationStatic(inquery.requester._id , 6)
  await refreshGT();
  await refreshGC();
  res.status(200).json({
    success: true,
    data: {},
  });
});




exports.Admincancel = asyncHandler(async (req, res, next) => {
  const isAdmin = req.user.group.includes("admin");
  const isSuperAdmin = req.user.group.includes("superAdmin");
  if (!isAdmin && !isSuperAdmin) {
    return next(new ErrorResponse("you dont have access to this route ", 401));
  }
  
//   console.log('enter for cancel by admin...' , req.user)
  console.log('body' , req.body)
  const Admin = req.user
  
  const canceler = {
    admin : req.user.username,
    number : req.user.phoneNumber,
    cause : req.body.cause
  }

  const inquery=await Inquiry.findByIdAndUpdate(req.params.id , {
    cancel:true, canceler : canceler , end : true
  })
   console.log('cancelation succeed>>>>>>' , inquery)
  await pushNotificationStatic( inquery.requester._id , 10)
  await refreshGT();
  await refreshGC();
  res.status(200).json({
    success: true,
    data: {},
  });
});



exports.changeStatusAdmin = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const isAdmin = user.group.includes("admin");
  const isSuperAdmin = user.group.includes("superAdmin");
  if (!isAdmin && !isSuperAdmin) {
    return next(new ErrorResponse("you dont have access to this route ", 401));
  }
  const order = await Inquiry.findById(req.params.id);
  const type=req.params.type //! with money ==>1 ---- with outMoney ==>0
  const newStatus = order.status + 1;
  const last = order.statusTime[order.statusTime.length - 1];
  let time;
  const respoonse=await changeTransportStatusForCommerce(newStatus, order.salse);
  if (order.statusTime.length == 0) {
    time = {
      status: newStatus,
      action: 1,
      at: Date.now(),
    };
  } else {
    time = {
      status: newStatus,
      action: last.action + 1,
      at: Date.now(),
    };
  }
  console.log('newStatus' , newStatus)
  await Inquiry.findByIdAndUpdate(  
    req.params.id,
    {
      $addToSet: { statusTime: time },
      status: newStatus,
    },
    { new: true }
  );
  const allV= await getAllVarible()
  const comi=allV.appComistionAmountTransport
  const depo=allV.truckDepositeAmount
  const transportAmount=(order.bid)*100
  const depositeAmount=transportAmount*(depo/100)
  
  if (newStatus == 8) 
    {
    const appComi=order.bid*(comi/100)*100
    const transportPaymnet=await walletUpdater(1,order.transport.userId,transportAmount,`Transport all money for shiping order ${order.productName}`)
    const transportPaymnetComi=await walletUpdater(0,order.transport.userId,appComi,`App comision for shiping order ${order.productName}`)
    if(!transportPaymnet.success||!transportPaymnetComi.success){
      return next(new ErrorResponse("wallet section error",500))
    }
    console.log('1111')
   const transportPaymnetApp=await walletUpdaterApp(0,order.transport.userId,transportAmount,`Transport all money for shiping order ${order.productName}`)
   const transportPaymnetComiApp=await walletUpdaterApp(1,order.transport.userId,appComi,`App comision for shiping order ${order.productName}`)
    if(!transportPaymnetApp.success||!transportPaymnetComiApp.success){
      return next(new ErrorResponse("wallet section error",500))
    }
    console.log('22222')
    const transportPaymnetDeposite=await walletUpdater(1,order.transport.userId,depositeAmount,`Get back  deposite for shiping order ${order.productName}`)
    const transportPaymnetComiAppDeposite=await walletUpdaterApp(0,order.transport.userId,depositeAmount,`Get back  deposite for shiping order${order.productName}`)
    if(!transportPaymnetDeposite.success||!transportPaymnetComiAppDeposite.success){
      return next(new ErrorResponse("wallet section error",500))
    }
    console.log('33333')
    await Inquiry.findByIdAndUpdate(req.params.id,{
      end:true,
      requsterPaymnetInvoiceNumber:transportPaymnetApp.data,
      transportPaymnetInvoiceNumber:transportPaymnet.data
    });
    console.log('4444')
    await refresinq(order)
    await pushNotificationStatic(order.requester._id,5)
  }
  console.log('5555')
  if(newStatus==5&&type==1){
    const transportPaymnetDeposite=await walletUpdater(0,order.transport.userId,depositeAmount,`Deposite shiping order ${order.productName}`)
    const transportPaymnetComiAppDeposite=await walletUpdaterApp(1,order.transport.userId,depositeAmount,`Deposite shiping order ${order.productName}`)
    if(!transportPaymnetDeposite.success||!transportPaymnetComiAppDeposite.success){
      console.log("wallet section amount");
      return next(new ErrorResponse("wallet section error",500))
    }
    await pushNotificationStatic(order.requester._id,4)
  }
  if(newStatus==6){
    await pushNotificationStatic(order.requester._id,7)
  }
  if(newStatus==7){
    await pushNotificationStatic(order.requester._id,8)
  } 
  await refresinq(order)
  res.status(200).json({
    success: true,
    data: {},
  });
});
// approve kardane yek transport company
// ! bayad to service cammerce buy sakhte she
// exports.approveOffer = asyncHandler(async (req, res, next) => {
//   const result = await Inquiry.findById(req.params.id);

//   result.prices.forEach(async (elem) => {
//     if (elem.userId == req.params.userId) {
//       // console.log("elem>>>>>>>>>>>>>", elem);

//       const data = {
//         buyer: result.requester,
//         // body
//         seller: req.body.seller,
//         origin: result.origin,
//         destination: result.destination,
//         transportCompany: elem,
//         priceTransportCompany: elem.price,
//         // body
//         price: req.body.price,
//         quantity: result.quantity,
//         buyType: 0,
//         status: 0,
//         salse: result.salse,
//       };

//       // console.log("dataaaaaaaaaaaaa", data);

//       const request = await createBuy(data);
//       if (request.success) {
//         await Inquiry.findByIdAndUpdate(req.params.id, {
//           status: 1,
//           $pull: { prices: { userId: { $ne: req.params.userId } } },
//         });
//       }
//     }
//   });

// refresh global vase hame transport ha
//   // ! globalTransport
//   await refreshGT();

//   //  refresh be hame businessman vase in ke taghirate on sales ro bebinan
//   // ! globalCommerce
//   await refreshGC();

//   res.status(200).json({
//     success: true,
//     data: result,
//   });
// });

exports.approveOfferNew = asyncHandler(async (req, res, next) => {
 const sender = {
    _id: req.user._id,
    username: req.user.username,
    pictureProfile:req.user.pictureProfile,
  };
  const result = await Inquiry.findById(req.params.id);
  const bidArray=result.bids
  const finalBidIndex=bidArray.findIndex(item=>item.userId==req.params.userId)
  if(finalBidIndex==-1){
    return next(new ErrorResponse("bid not found ", 400));
  }
  const finalBid=bidArray[finalBidIndex].bid
  const user = await Transport.findOne({
    "user._id":req.params.userId ,
  });
  const obj = {
    userId: req.params.userId,
    idCompany: user._id,
    profileCompany: user.profileCompany,
    companyName: user.companyName,
    username: user.user.username,
    phone: user.user.phone,
    bid:finalBid,
    address: user.companyAddress[0].address,
  };
  await Inquiry.findByIdAndUpdate(
    req.params.id,
    {
      transport: obj,
      status: 2,
      contract: true,
      minId:req.params.userId,
      bid:finalBid
    }
  );
  bidArray.map(async(item)=>{
    if(item.userId!=req.params.userId){
          
      const reciver={
        _id: item.userId,
        username: item.username,
        pictureProfile:item.profileCompany,
      }

     await pushNotificationStatic(reciver._id , 3)
    }
      })
   const recipient = {
        _id: user.user._id,
        username: user.user.username,
        pictureProfile: user.user.pictureProfile,
    };
  
  // console.log(result.requester._id);
  await pushNotificationStatic(recipient._id , 2)
  await refreshGT()
  await SingleCommerceT(result.requester._id)


  res.status(200).json({
    success: true,
    data: {},
  });
});

exports.msg = asyncHandler(async (req, res, next) => {
  const { text, image } = req.body;
  let sender;
  let recipient;

  const message = {
    text: text,
    image: image,
    user: req.user._id,
    username: req.user.username,
    phone: req.user.phone,
    pictureProfile: req.user.pictureProfile,
    at: Date.now(),
  };
  
  const updateOrder = await Inquiry.findByIdAndUpdate(req.params.id, {
    $addToSet: { message },
  });

  // console.log(updateOrder);

  // if (updateOrder.requster._id === req.user._id) {
  //   console.log("in");
  //   sender = {
  //     _id: req.user._id,
  //     username: req.user.username,
  //     pictureProfile: req.user.pictureProfile,
  //   };
  //   console.log("sender",sender);
  //   recipient = {
  //     _id: updateOrder.transport.userId,
  //     username: updateOrder.transport.username,
  //     pictureProfile: updateOrder.transport.profileCompany,
  //   };
  //   console.log("res",recipient);

  // } else {
  //   sender = {
  //     _id: req.user._id,
  //     username: req.user.username,
  //     pictureProfile: req.user.pictureProfile,
  //   };

  //   recipient = {
  //     _id: updateOrder.requster._id,
  //     username: updateOrder.requster.username,
  //     pictureProfile: updateOrder.requster.profileCompany,
  //   };
  // }

  

  // await pushNotification(
  //   "message",
  //   `You have message from ${sender.username}`,
  //   "information",
  //   recipient,
  //   sender,
  //   "Transportstack",
  //   "Inquery"
  // );
  // await notification(
  //   "message",
  //   sender,
  //   recipient,
  //   updateOrder._id,
  //   "Order",
  //   "You have message",
  //   "Transportstack"
  // );

  console.log("updateOrder.transport.userId" , updateOrder.transport.userId);
  console.log("updateOrder.requester._id" , updateOrder.requester._id);
  const messager = (req.user._id == updateOrder.transport.userId) ? updateOrder.requester._id : updateOrder.transport.userId;
  pushNotificationStatic( messager , 11)
  await refreshchat(updateOrder.transport.userId,updateOrder.requester._id)
  // await refreshGC();
 
  res.status(200).json({
    success: true,
    data: {},
  });
});


exports.changeStatus = asyncHandler(async (req, res, next) => {
  const order = await Inquiry.findById(req.params.id);
  const newStatus = order.status + 1;
  const respoonse=await changeTransportStatusForCommerce(newStatus, order.salse);
  const last = order.statusTime[order.statusTime.length - 1];
  let time;
  if (order.statusTime.length == 0) {
    time = {
      status: newStatus,
      action: 1,
      at: Date.now(),
    };
  } else {
    time = {
      status: newStatus,
      action: last.action + 1,
      at: Date.now(),
    };
  }

  await Inquiry.findByIdAndUpdate(  
    req.params.id,
    {
      $addToSet: { statusTime: time },
      status: newStatus,
    },
    { new: true }
  );
  const allV= await getAllVarible()
  const comi=allV.appComistionAmountTransport
  const depo=allV.truckDepositeAmount
  const transportAmount=(order.bid)*100
  const depositeAmount=transportAmount*(depo/100)
  
  if (newStatus == 8) 
    {

    const appComi=order.bid*(comi/100)*100
    
    const transportPaymnet=await walletUpdater(1,order.transport.userId,transportAmount,`Transport all money for shiping order ${order.productName}`)
    const transportPaymnetComi=await walletUpdater(0,order.transport.userId,appComi,`App comision for shiping order ${order.productName}`)
    if(!transportPaymnet.success||!transportPaymnetComi.success){
      return next(new ErrorResponse("wallet section error",500))
    }
   const transportPaymnetApp=await walletUpdaterApp(0,order.transport.userId,transportAmount,`Transport all money for shiping order ${order.productName}`)
   const transportPaymnetComiApp=await walletUpdaterApp(1,order.transport.userId,appComi,`App comision for shiping order ${order.productName}`)
    if(!transportPaymnetApp.success||!transportPaymnetComiApp.success){
      return next(new ErrorResponse("wallet section error",500))
    }
    const transportPaymnetDeposite=await walletUpdater(1,order.transport.userId,depositeAmount,`Get back  deposite for shiping order ${order.productName}`)
    const transportPaymnetComiAppDeposite=await walletUpdaterApp(0,order.transport.userId,depositeAmount,`Get back  deposite for shiping order${order.productName}`)
    if(!transportPaymnetDeposite.success||!transportPaymnetComiAppDeposite.success){
      return next(new ErrorResponse("wallet section error",500))
    }
    
    await Inquiry.findByIdAndUpdate(req.params.id,{
      end:true,
      requsterPaymnetInvoiceNumber:transportPaymnetApp.data,
      transportPaymnetInvoiceNumber:transportPaymnet.data
    });
    
    await refresinq(order)
    await pushNotificationStatic(order.requester._id , 5)
  }
  
  await refresinq(order)
  if(newStatus==5){
    const transportPaymnetDeposite=await walletUpdater(0,order.transport.userId,depositeAmount,`Deposite shiping order ${order.productName}`)
    const transportPaymnetComiAppDeposite=await walletUpdaterApp(1,order.transport.userId,depositeAmount,`Deposite shiping order ${order.productName}`)
    if(!transportPaymnetDeposite.success||!transportPaymnetComiAppDeposite.success){
      return next(new ErrorResponse("wallet section error",500))
    }
    await pushNotificationStatic(order.requester._id , 4)
  }
  if(newStatus==6){
    await pushNotificationStatic(order.requester._id , 7)
  }
  if(newStatus==7){
    await pushNotificationStatic(order.requester._id , 8)
  }
  
  res.status(200).json({
    success: true,
    data: {},
  });
});

exports.getAllInfoForTransport = asyncHandler(async (req, res, next) => {
  const transport=await Transport.findOne({"user._id":req.user._id})
  if(!transport){
    return next(new ErrorResponse("Transport not found",404))
  }
  const all = await Inquiry.find({"transport.idCompany": transport._id  })
  
  const wait = await Inquiry.find({
    $and: [
      { "transport.idCompany":transport._id },

      {
        status: { $lt: 4 },
      },
    ],
  });

  
 
  const accept = await Inquiry.find({
    $and: [
      { "transport.idCompany": transport._id  },
      { status: { $lt: 10 } },
      {
        status: { $gt: 3 },
      },
    ],
  });
   
  
   

  res.status(200).json({
    success: true,
     all:all.length,
     biding:wait.length,
     onGoing:accept.length
  });
});

exports.logestic= asyncHandler(async (req, res, next) => {
  const sender = {
    _id: req.user._id,
    username: req.user.username,
    pictureProfile:req.user.pictureProfile,
  };
  const result = await Inquiry.findById(req.params.id);
  const bidArray=result.bids 
  bidArray.map(async(item)=>{
    const reciver={
      _id: item.userId,
      username: item.username,
      pictureProfile:item.profileCompany,
    }

    await pushNotificationStatic(reciver._id,6)
    // await pushNotification(
    //   `Inquery Cancel By ${sender.username}`,
    //   `Inquery Cancel By ${sender.username}`,
    //   `Inquery Cancel By ${sender.username}`,
    //   reciver,
    //   sender,
    //   "transortStack",
    //   "Inquery"
    // );
    // await notification(
    //   `Inquery Cancel By ${sender.username}`,
    //   sender,
    //   reciver,
    //   result._id,
    //   "Inquery",
    //   "transportStack",
    //   "Inquery"
    // );
  })
   
  await Inquiry.findByIdAndRemove(req.params.id)
 
  await refreshGT();
  await refreshGC();
  
 return res.status(200).json({success:true})
})
