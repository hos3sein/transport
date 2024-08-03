const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const fetch = require("node-fetch");
const moment=require("moment")
const Transport = require("../models/Transport");
const Inquiry = require("../models/Inquiry");
const Group = require("../models/Group");
const { refresh, refreshGT, refreshGC } = require("../utils/refresh");
const { findSales,notification,pushNotification } = require("../utils/request");

//In connection with approve service
exports.createTransport = asyncHandler(async (req, res, next) => {
  const create = await Transport.create(req.body);

  res.status(200).json({
    success: true,
    data: {},
  });
});

//In connection with approve service


//In connection with connerce service
exports.changeStatusInauiry = asyncHandler(async (req, res, next) => {
  const {userId,saleId} = req.body;
  const find = await Inquiry.findOne({
    $and: [{ salse: saleId }, { contract: true },{"responser._id":userId}],
  });
  if(!find){
    return next(new ErrorResponse("Inqury not found",404))
  }
  const time = {
    status: 4,
    action: 0,
    at: Date.now(),
  };
//  await Inquiry.findOneAndUpdate({
//   $and: [{ salse: saleId }, { contract: true },{"responser._id":userId}],
//  },{
//   status:4,
//   statusTime:time,
//   commerceStatus:4
//  })
     find.status=4
     find.statusTime=time,
     find.commerceStatus=4
     await find.save()
 
     
  // refresh taki bade har change status
  await refreshGT();
  await refreshGC();

  // ! refreshTransport
  

  res.status(200).json({
    success: true,
    data: {},
  });
});
exports.changeSaleStatus= asyncHandler(async (req, res, next) => {
    const {status,saleId,action,userId}=req.body
    const find = await Inquiry.findOne({
      $and: [{ salse: saleId },{ contract: true },{"requster._id":userId}]})
      if(!find){
        return next(new ErrorResponse("Inqury not found",404))
      }
      
      const time={
        status:status,
        action:action,
        at:Date.now()
      }
      // if(status==10){
      //   find.commerceStatusTime=time,
      //   find.commerceStatus=status
      //   await find.save()
      // }else{
        find.commerceStatusTime=time,
        find.commerceStatus=status
        await find.save()
      // }

      // sender = {
      //   _id: find.requester._id,
      //   username: find.requester.username,
      //   pictureProfile: find.requester.profileCompany,
      // };
      //  recipient = {
      //   _id: find.transport.userId,
      //   username: find.transport.username,
      //   pictureProfile:find.transport.profileCompany,
      // };
      // await pushNotification(
      //   "Inquery",
      //   "Status Cahnge",
      //   `${find.productName} status change Check it !!! `,
      //   recipient,
      //   sender,
      //   "Transport",
      //   "Transport"
      // );
      // await notification(
      //   "Inquery",
      //   recipient,
      //   sender,
      //   create._id,
      //   "Transport",
      //   "Status Cahnge",
      //   `${find.productName} status change Check it !!! `,
      // );
 
      await refreshGT();
      await refreshGC()
      res.status(200).json({
        success: true,
        data: {},
      });

})


//In connection with connerce service
exports.msg = asyncHandler(async (req, res, next) => {
  const {
    status,
    action,
    at,
    text,
    image,
    user,
    username,
    phone,
    pictureProfile,
  } = req.body;

  const find = await Inquiry.findOne({
    $and: [{salse:req.params.id},{contract:true}],
  });  
  const obj = {
    status: status,
    action: action,
    text: text,
    image: image,
    user: user,
    username: username,
    phone: phone,
    pictureProfile: pictureProfile,
    at: at,
  };

  const create = await Inquiry.findByIdAndUpdate(find._id, {
    $addToSet: { statusTime: obj },
  });

  // refresh taki bade har change status
  

  // ! refreshTransport

  await refresh(find[0].transport.userId, "refreshTransport");

  
  res.status(200).json({
    success: true,
    data: {},
  });
});

//In connection with connerce service
exports.find = asyncHandler(async (req, res, next) => {
  console.log("niceffffffffffffffffffffff")

  console.log("fsedvs");
  const find = await Inquiry.findOne({
    $and: [
      { salse: req.params.id },
      { contract: true },
      {"requester._id":req.params.user}
    ],
  });

   console.log(find);

  if(!find){
    return res.status(200).json({
      success: false,
      data: {},
    });
  }
    res.status(200).json({
      success: true,
      data: find,
    });
});
exports.findOrder=asyncHandler(async (req, res, next) => {
  const order=await Inquiry.findById(req.params.id)
  
  res.status(200).json({
    success: true,
    data: order,
  });
});

exports.inpection=asyncHandler(async (req, res, next) => {
  if(req.params.type=="init"){
    const order=await Inquiry.findOneAndUpdate({
      salse:req.params.id
    },{
      inspectorRequire:true,
      inspectorStatus:1,
    })
  }
  if(req.params.type=="approve"){
    const order=await Inquiry.findOneAndUpdate({
      salse:req.params.id
    },{
      inspectorStatus:2,
    })
  }
  if(req.params.type=="reject"){
    const order=await Inquiry.findOneAndUpdate({
      salse:req.params.id
    },{
      inspectorStatus:3,
    })
  }
  res.status(200).json({
    success: true,
  });
});

exports.getInfoForChart=asyncHandler(async (req, res, next) => {
  const orders= await Inquiry.find()  
  const mainArray=[]

  const to1=moment().format("YYYY-MM-DD")
  const day=to1.split("-")[2]
  const frome1=moment(to1).add(-day+1,"d").format("YYYY-MM-DD")

  const obj1={frome:frome1,to:to1,totalAmount:0}
  
  const to2=moment(frome1).format("YYYY-MM-DD")
  const frome2=moment(to2).add(-1,"M").format("YYYY-MM-DD")
  
  const obj2={frome:frome2,to:to2,totalAmount:0}

  const to3=moment(frome2).format("YYYY-MM-DD")
  const frome3=moment(to3).add(-1,"M").format("YYYY-MM-DD")

  const obj3={frome:frome3,to:to3,totalAmount:0}

  const to4=moment(frome3).format("YYYY-MM-DD")
  const frome4=moment(to4).add(-1,"M").format("YYYY-MM-DD")
  const obj4={frome:frome4,to:to4,totalAmount:0}

  const to5=moment(frome4).format("YYYY-MM-DD")
  const frome5=moment(to5).add(-1,"M").format("YYYY-MM-DD")

  const obj5={frome:frome5,to:to5,totalAmount:0}

  const to6=moment(frome5).format("YYYY-MM-DD")
  const frome6=moment(to6).add(-1,"M").format("YYYY-MM-DD")

  const obj6={frome:frome6,to:to6,totalAmount:0}
  orders.forEach(item=>{
    const test=moment(item.createdAt)
   
    const isRange1=moment(item.createdAt).isBetween(frome1,to1)
    const isRange2=moment(item.createdAt).isBetween(frome2,to2)
    const isRange3=moment(item.createdAt).isBetween(frome3,to3)
    const isRange4=moment(item.createdAt).isBetween(frome4,to4)
    const isRange5=moment(item.createdAt).isBetween(frome5,to5)
    const isRange6=moment(item.createdAt).isBetween(frome6,to6)
    if(isRange1&&item.cancel==false&&item.status>4){
      obj1.totalAmount=obj1.totalAmount+item.bid
    }
    if(isRange2&&item.cancel==false&&item.status>4){
      obj2.totalAmount=obj2.totalAmount+item.bid
    }
    if(isRange3&&item.cancel==false&&item.status>4){
      obj3.totalAmount=obj3.totalAmount+item.bid
    }
    if(isRange4&&item.cancel==false&&item.status>4){
      obj4.totalAmount=obj4.totalAmount+item.bid
    }
    if(isRange5&&item.cancel==false&&item.status>4){
      obj5.totalAmount=obj5.totalAmount+item.bid
    }
    if(isRange6&&item.cancel==false&&item.status>4){
      obj6.totalAmount=obj6.totalAmount+item.bid
    }
  })
  
  mainArray.push(obj1)
  mainArray.push(obj2)
  mainArray.push(obj3)
  mainArray.push(obj4)
  mainArray.push(obj5)
  mainArray.push(obj6)
    
 res.status(200).json({
  success:true,
  mainArray
 })
});


exports.handelDelete=asyncHandler(async (req, res, next) => {
  // const order=await Inquiry.findOneAndDelete({salse:req.params.id})
  console.log("start end inquery");
  
  await Inquiry.updateMany({salse:req.params.id},{end:true})

  console.log("afetr end Inquery");
  await refreshGT()
  res.status(200).json({
    success: true,
    
  });
}); 

exports.handelCancel=asyncHandler(async (req, res, next) => {
  const {responser,id}=req.body
  await Inquiry.updateMany({
    $and:[
      {salse:id},
      {"responser._id":responser}
    ]
  },{
    cancel:true
  })
  res.status(201).json({
    success:true,
  })
})

exports.handelCancelAfterContractHaveTransport=asyncHandler(async (req, res, next) => {
  const {requester,id}=req.body 

  const allMustcancel=await Inquiry.find({
    $and:[
      {salse:id},
      {"requester._id":{$ne:requester}}
    ]
  })

  if(allMustcancel.length==0){
    return res.status(200).json({
      success:true
    })
  }

  allMustcancel.forEach(async(inq)=>{
    if(inq.transport.userId){
      const sender={
        _id: inq.responser._id,
        username: inq.responser.username,
        pictureProfile:inq.responser.profileCompany,
      }
       const reciver={
        _id: inq.transport.userId,
        username: inq.transport.username,
        pictureProfile:inq.transport.profileCompany,
      }

      await pushNotification(
        `Inquery cancel`,
        `Inquery cancel`,
        `Inquery cancel`,
        reciver,
        sender,
        "transortStack",
        "Inquery"
      );
      await notification(
        `Inquery cancel`,
        sender,
        reciver,
        result._id,
        "Inquery",
        "transportStack",
        "Inquery"
      );
    }
  })

  await Inquiry.updateMany({
    $and:[
      {salse:id},
      {"requester._id":{$ne:requester}}
    ]
  },{
    cancel:true
  })
  res.status(200).json({
    success:true,
  })
})

exports.handelCancelAfterContractWithoutTransport=asyncHandler(async (req, res, next) => {
  const {id}=req.body
  const allMustcancel=await Inquiry.find({
    salse:id,
  })
  if(allMustcancel.length==0){
    return res.status(200).json({
      success:true
    })
  }
  allMustcancel.forEach(async(inq)=>{
    if(inq.transport.userId){
      const sender={
        _id: inq.responser._id,
        username: inq.responser.username,
        pictureProfile:inq.responser.profileCompany,
      }
       const reciver={
        _id: inq.transport.userId,
        username: inq.transport.username,
        pictureProfile:inq.transport.profileCompany,
      }

      await pushNotification(
        `Inquery Cancel By ${sender.username}`,
        `Inquery Cancel By ${sender.username}`,
        `Inquery Cancel By ${sender.username}`,
        reciver,
        sender,
        "transortStack",
        "Inquery"
      );
      await notification(
        `Inquery Cancel By ${sender.username}`,
        sender,
        reciver,
        result._id,
        "Inquery",
        "transportStack",
        "Inquery"
      );
    }
  })

  await Inquiry.updateMany({
      salse:id
  },{
    cancel:true
  })


  res.status(200).json({
    success:true,
  })
})