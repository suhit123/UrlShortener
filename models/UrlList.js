const mongoose=require('mongoose');
const UrlListschema=new mongoose.Schema({
    bigUrl:{
        type:String,
        required:true,
    },
    shortenUrl:{
        type:String,
        required:true
    }
})
module.exports=mongoose.models.UrlList || mongoose.model('UrlList',UrlListschema)