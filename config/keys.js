module.exports = {
    mongoURL: "mongodb://127.0.0.1:27017/shanfang",
    secretOrKey: "jwtsecret",
    loginExpire: 7200,          // 每次登陆可维持 时长
    newLoginExpire: 21600,      // 每次登陆可维持 最大时长
    accessKeyId: 'LTAIsMl0GQgG1woq',            //阿里云
    accessKeySecret: '87Y6IWiy4s0noRTmryskiRCRyORtXP' ,        //阿里云
    sessionMaxAge:60000 ,  // 服务端 session过期时间 单位毫秒 此处设为1分钟
    registerVerifyEffect:300000 //注册验证码有效时间，单位毫秒 此处设为5分钟
}