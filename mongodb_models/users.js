const mongoose = require("mongoose");
const users_schema = new mongoose.Schema({
    nickname: String,                 // 昵称
    phone: String,
    password: String,
    sign: {                           // 个人签名
        type: String,
        default: '宝宝心里苦，什么也不想说！'
    },
    avatar: String,                  // 头像 
    gender: {                        // 0:不详,默认值; 1:男生,2:女生
        type: String,
        default: 0
    },
    birthday: String,                // 生日 
    education: String,               // 学历
    height: Number,                  // 身高
    weight: Number,                  // 体重
    email:String,                    // 邮箱
    address: String,                 // 地址
    hobby: Array,                    // 爱好
    tags: Array,                    // 个人标签
    // tags:[{
    //     text:String,
    //     time:String,
    //     markerNickname:String,
    //     markerPhone:String,
    //     bgColor:String,   背景色
    //     tColor:String       文本色
    // }]
    good: {                          // 好评
        type: Number,
        default: 0
    },
    bad: {                           // 差评
        type: Number,
        default: 0
    },
    userRemarks: Object,            // 备注
    userGroup: {
        type: String,
        default: '普通用户'
    },
    authory: Object,
    currentState: {                 // 当前用户状态
        type: String,
        default: '正常'
    },
    currentStateHandler: String,    // 操作员
    handleRemarks: Object,          // 操作理由
    userSet: Object,                // 用户设置
})
const users_model = mongoose.model("users", users_schema, "users")
module.exports = users_model;