const mongoose = require("mongoose");

const InquirySchema = new mongoose.Schema(
  {
    requester: {
      _id: { type: mongoose.Schema.ObjectId },
      idCompany: { type: mongoose.Schema.ObjectId },
      profileCompany: { type: String },
      companyName: { type: String },
      phone: { type: String },
      username: { type: String },
      
    },
    responser: {
      _id: { type: mongoose.Schema.ObjectId },
      idCompany: { type: mongoose.Schema.ObjectId },
      profileCompany: { type: String },
      companyName: { type: String },
      phone: { type: String },
      username: { type: String },
    },

    address: {
      address: { type: String },
      nameAddress: { type: String },
      latitude: { type: Number },
      longitude: { type: Number },
      target: { type: Number },
      city: { type: String },
      province: { type: String },
      district: { type: String },
      street: { type: String },
      country: { type: String },
      streetNumber: { type: String },
      _id: false,
    },

    addressTo: {
      address: { type: String },
      nameAddress: { type: String },
      latitude: { type: Number },
      longitude: { type: Number },
      target: { type: Number },
      city: { type: String },
      province: { type: String },
      district: { type: String },
      country: { type: String },
      streetNumber: { type: String },
      number: { type: String },
      _id: false,
    },
    message: [
      {
        text: String,
        image: String,
        user: mongoose.Schema.ObjectId,
        username: String,
        phone: String,
        pictureProfile: String,
        at: String,
        _id: false,
      },
    ],

    // prices: [
    //   {
    //     userId: { type: mongoose.Schema.ObjectId },
    //     idCompany: { type: mongoose.Schema.ObjectId },
    //     username: { type: String },
    //     profileCompany: { type: String },
    //     companyName: { type: String },
    //     phone: { type: String },
    //     price: { type: Number },
    //     address: { type: String },
    //     _id: false,
    //   },
    // ],

    transport: {
      userId: { type: mongoose.Schema.ObjectId },
      idCompany: { type: mongoose.Schema.ObjectId },
      username: { type: String },
      profileCompany: { type: String },
      companyName: { type: String },
      phone: { type: String },
      bid: { type: Number },
      address: { type: String },
    },


    bid: { type: Number, default: 0 },

    minId: { type: mongoose.Schema.ObjectId },

    bids: [
      {
        companyId: mongoose.Schema.ObjectId,
        userId: mongoose.Schema.ObjectId,
        profileCompany: String,
        companyName: String,
        phone: String,
        username: String,
        bid: Number,
        status: String,
        at: String,
        _id: false,
      },
    ],
   

    productType: {
      type: Number,
    },

    productName: {
      type: String,
    },

    labReport: [String],

    grade: {
      type: Number,
    },

    quantity: {
      type: Number,
    },

    fineness: {
      type: Number,
    },

    flashPoint: {
      type: Number,
    },

    waterContent: {
      type: Number,
    },

    phoneNumber: {
      type: String,
    },

    phoneNumberTo: {
      type: String,
    },

    lineMaker: {
      type: Boolean,
    },
    lineMakerTo: {
      type: Boolean,
    },
    dateFrom: {
      day: { type: Number },
      month: { type: Number },
      year: { type: Number },
    },
    dateTo: {
      day: { type: Number },
      month: { type: Number },
      year: { type: Number },
    },

    shipmentAmount: {
      type: Number,
    },

    closingDate: {
      type: Number,
    },

    note: { type: String },

    transportMethod: {
      truck: { type: Boolean, default: false },
      ship: { type: Boolean, default: false },
      rail: { type: Boolean, default: false },
    },

    // 0 == seller
    // 1 == buyer
    type: {
      type: Number,
    },

    salse: {
      type: mongoose.Schema.ObjectId,
    },

    createdAtCommerce: {
      type: String,
    },

    updatedAtCommerce: {
      type: String,
    },

    
    statusTime: [
      {
        text: String,
        image: String,
        user: mongoose.Schema.ObjectId,
        username: String,
        phone: String,
        pictureProfile: String,
        action: Number,
        status: Number,
        at: String,
        _id: false,
      },
    ],

    status: { type: Number },

    contract: { type: Boolean, default: false },

    cancel:{type: Boolean, default: false },

    end:{type: Boolean, default: false },
    commerceStatusTime: [
      {
        text: String,
        image: String,
        user: mongoose.Schema.ObjectId,
        username: String,
        phone: String,
        pictureProfile: String,
        action: Number,
        status: Number,
        at: String,
        _id: false,
      },
    ],

    commerceStatus:{type: Number},

    inspectorRequire:{
      type:Boolean,
      default:false
    },
    inspectorStatus:{ //? 0=pending  1=Approve  2=reject
       type:Number,
       default:0
    },

    inspectorPrice:{
      type:Number,
      default:0
    },
    
    canceler : {
      admin : {type : String },
      number : {type : String},
      cause : {type : String}
    },
    requsterPaymnetInvoiceNumber:{
      type:String
    },

    transportPaymnetInvoiceNumber:{
      type:String
    },
    getQuotePaymnetInvoiceNumber:{
      type:String
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inquiry", InquirySchema);
