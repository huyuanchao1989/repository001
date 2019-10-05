const mongoose = require("mongoose");
const registerRecords_schema = new mongoose.Schema({
    nickname: String,  //昵称
    phone: String,
    password: String,
    remarks: String,  //备注
    registerTime: String,
    registerState: String,  //注册状态
    handler: String,   // 操作员
    handlerPhone:String,
    handleText: String, //操作说明
    handleTime: String
})
const registerRecords_model = mongoose.model("registerRecords", registerRecords_schema, "registerRecords")
module.exports = registerRecords_model;