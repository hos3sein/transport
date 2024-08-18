const Inquiry = require("../models/Inquiry")
const { refresh, refreshGT, refreshGC,SingleCommerceT,refreshchat,refresinq} = require("./refresh");


exports.checker =async()=>{
    const waiting = await Inquiry.find({$and:[{status : 0},{cancel : false}]})
    waiting.forEach(element => {
        const timePeriod = element.closingDate
        const startTime = new Date(element.createdAt)
        const currentTime = new Date()
        const deifrentTime = currentTime-startTime
        if (deifrentTime > timePeriod*60*60*1000){
            Inquiry.findByIdAndUpdate(element._id , {cancel : true}).then(async(resault)=>{
                console.log('the order time finished>>>>' , element.productName)
                await refreshGT()
                await refreshGC()
            }).catch((err)=>{
                console.log('error occured while finishing the order >>>' , element.productName , err)
            })
        }
    });
    
}


