const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const { mongoURL, sessionMaxAge } = require("./config/keys");
const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
const passport = require("passport");
const session = require('express-session')
const User = require('./routes/User');


mongoose.connect(mongoURL, { useNewUrlParser: true }, (err) => {
    if (err) throw err;
    console.log("Mongoose is connected to ", mongoURL);
})

app.use(session({
    // name: 设置cookie中，保存session的字段名称，默认为connect.sid
    // store: session的存储方式，默认为存放在内存中，我们可以自定义redis,数据库等
    // rolling: 每个请求都重新设置一个cookie，默认为false
    secret: 'my_session_secret', // 加密密文 ，建议使用 128 个字符的随机字符串
    resave: true,  //即使session没有被修改，也保存session值，默认为true
    saveUninitialized: true, //初始化
    // cookie: {
    //     // maxAge: sessionMaxAge,
    //     maxAge: 60,
    // }
}))

//中间件:使用body-parser处理post请求主体
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//初始化pssport
app.use(passport.initialize());
//中间件:使用passport passport-jwt验证token
require("./config/passport")(passport)


app.use('/', User)


app.listen(port, (err) => {
    if (err) throw err;
    console.log("Server is running on port ", port, "...");
})