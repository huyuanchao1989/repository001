const express = require("express");
const router = express.Router();
const rrm = require("../mongodb_models/registerRecords.js")
const um = require("../mongodb_models/users")
const bcrypt = require("bcryptjs"); //加密
const jwt = require("jsonwebtoken");
const checkToken = require("../checkToken")
const { secretOrKey, loginExpire, newLoginExpire, registerVerifyEffect } = require("../config/keys")
const sendSms = require('./api/AliyunSms')



//登陆 、用bcrypt验证密码 、并生成token
router.get("/login", (req, res, next) => {
    // 1:查找手机号，并获取数据库内的密码
    um.findOne({ "phone": req.query.phone }, (err, data) => {
        if (err) throw err
        if (!data) {
            res.status(200).json({ "code": "0", "msg": "号码不存在！" })
        } else {
            // 2:请求头内的密码和数据库内的密码通过bcrypt方式匹配验证
            bcrypt.compare(req.query.password, data.password)
                .then(isMatch => {
                    if (!isMatch) {
                        res.status(200).json({ "code": "0", "msg": "密码错误！" })
                    } else {
                        // 3:上一步验证成功后通过jwt生成token并返回
                        // jwt.sign("规则","加密的名字","过期时间 ","回调函数")
                        const rule = { "id": data.id, phone: data.phone, nickname: data.nickname }   //组合规则，在验证环节，同样可以取出该字段，可以随意设置，最好是对自己有用的字段
                        // let expireTime;
                        const expireTime = req.query.isDefer ? newLoginExpire : loginExpire
                        jwt.sign(rule, secretOrKey, { expiresIn: expireTime }, (err, token) => {
                            if (err) throw err;
                            res.json({ "code": "1", "msg": "OK", "token": "Bearer " + token });//bearer后一定要加空格 
                        })
                    }
                })
        }

    })


})

//检测phone是否存在 DBcollection:users
router.get("/register/phone", (req, res, next) => {
    //先在users中查询，有没有存在此号码
    um.findOne({ "phone": req.query.phone }, (err, data) => {
        if (err) throw err;
        if (data) {
            res.status(200).json({ "code": "1", "msg": "该手机号已被其它人注册并通过" });
        } else {
            // 查询不到时在registerRecords中查询，是否有待处理的申请记录
            rrm.findOne({ "phone": req.query.phone, "registerState": "待处理" }, (err, data) => {
                if (err) throw err;
                if (data) {
                    res.status(200).json({ "code": "1", "msg": "该号码有正在处理中的申请" });
                } else {
                    res.status(200).json({ "code": "0", "msg": "未匹配到手机号" });
                }
            })
        }
    })
})

//  生成验证码
router.get("/register/sendVerify", (req, res, next) => {
    //封装的生成随机数的函数，区设定区间
    function createRandom(minNum, maxNum) {
        switch (arguments.length) {
            case 1:
                return parseInt(Math.random() * minNum + 1, 10);
            case 2:
                return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
            default:
                return Math.random();
        }
    }

    let randomNum = createRandom(100000, 999999)
    let phone = req.query.phone

    // 将短信验证码相关信息存入session
    function setSession() {
        req.session.registerVerifyCode = {
            'randomNum': randomNum,
            'phone': phone,
            'createTime': new Date().getTime()
        }
    }
    const opt = {
        'PhoneNumbers': phone,
        'SignName': "畅联三方",
        'TemplateCode': 'SMS_170156406',
        'TemplateParam': '{"code":' + randomNum + '}',
        'resolve': (result) => {     //信息发送成功的回调
            setSession()
            res.json({ code: 'ok', msg: result })
        },
        'reject': (err) => {            //信息发送失败的回调
            setSession()
            res.json({ code: 'error', msg: err })
        }
    }
    sendSms(opt);

})

//获取 服务器发送验证码时间
router.get('/register/getVerifyTime', (req, res, next) => {
    if (req.session.registerVerifyCode) {
        res.json({
            'code': 'ok',
            'createTime': req.session.registerVerifyCode.createTime,
            'phone': req.session.registerVerifyCode.phone
        })
    } else {
        res.json({ 'code': 'null' })
    }
})

// 验证 手机短信
router.get('/register/verify', (req, res, next) => {
    let serverVerify = req.session.registerVerifyCode
    if (!serverVerify) {
        res.json({ code: 'error', msg: '未发送验证码！' })
        return
    }
    let ct = req.query.sendTime,
        cp = req.query.relativePhone,
        cc = req.query.verifyCode,
        st = serverVerify.createTime,
        sp = serverVerify.phone,
        sc = serverVerify.randomNum

    if (cp !== sp) {
        res.json({ code: 'error', msg: '该手机号与发送验证码的手机号不匹配！' })
    } else if (parseInt(cc) !== sc) {
        res.json({ code: 'error', msg: '验证码错误！' })
    } else if (parseInt(ct) > (st + registerVerifyEffect)) {
        res.json({ code: 'error', msg: '验证码已过期！' })
    } else {
        res.json({ code: 'ok' })
    }


})

//注册 、 用bcrypt加密 、并存于数据库
router.post("/register", (req, res, next) => {
    let newUser = new rrm({
        "nickname": req.body.nickname,
        "phone": req.body.phone,
        "password": req.body.password,
        "remark": req.body.remark,
        "registerTime": new Date().toLocaleString(),
        "registerState": '待处理'
    })
    //  bcrypt加密 处理
    bcrypt.genSalt(10, function (err, salt) {
        if (err) throw err;
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
                .catch(err => { throw err })
                .then(result => res.status(200).json({
                    "code": "1",
                    "msg": "注册成功！！",
                    "result": result
                }))
        })
    })
})



router.get('/registerRecords', checkToken(), (req, res, next) => {
    if (req.query.type === 'pending') {
        rrm.find({ 'registerState': '待处理' }, (err, data) => {
            if (err) throw err;
            if (!data) {
                res.status(404).send('没有待处理的申请记录！')
            } else {
                res.status(200).send(data)
            }
        })
    } else if (req.query.type === 'all') {
        rrm.find({}, (err, data) => {
            if (err) throw err;
            if (!data) {
                res.status(404).send('请求的数据不存在 ！')
            } else {
                res.status(200).send(data)
            }
        })
    } else {
        res.status(400).send('请求类型错误，只允许pending all ')
    }
})

// 申请记录 通过与不通过 处理
router.post('/registerHandle', checkToken(), (req, res, next) => {

    let _id = req.body._id,
        sendMsg = req.body.sendMsg,
        userPhone = req.body.userPhone,
        nickname = req.body.nickname,
        password = req.body.password,
        registerState = req.body.registerState === '1' ? '通过' : '不通过',
        funcArr = []    // Promise.all 

    if (sendMsg) {
        let opt = {} // 发送短信的配置信息
        opt.SignName = '畅联三方';
        opt.PhoneNumbers = userPhone;
        if (registerState === '通过') {
            opt.TemplateCode = 'SMS_171856539'
            opt.TemplateParam = JSON.stringify({ nickName: nickname })
        } else {
            opt.TemplateCode = 'SMS_171856542'
            opt.TemplateParam = JSON.stringify({ nickName: nickname, res: req.body.handleText })
        }

        funcArr.push(
            new Promise((resolve, reject) => {
                opt.resolve = () => resolve('短信发送成功！')
                opt.reject = (err) => reject('短信发送失败！错误信息：' + err.data.Message)
                sendSms(opt)
            })
        )
    }

    funcArr.push(
        new Promise((resolve, reject) => {
            rrm.findOne({ _id: _id }, (err, user) => {
                if (err) reject(err);
                user.registerState = registerState
                user.handleText = req.body.handleText
                user.handler = req.body.handler
                user.handlerPhone = req.body.handlerPhone
                user.handleTime = new Date().toLocaleString()
                user.save()
                    .catch(err => { reject(err) })
                    .then(() => {
                        resolve('记录修改成功！')
                    })
            })
        })
    )

    if (registerState === '通过') {
        funcArr.push(
            new Promise((resolve, reject) => {
                new um({
                    nickname: nickname,
                    phone: userPhone,
                    password: password
                })
                    .save()
                    .catch(err => { reject(err) })
                    .then((resu) => {
                        resolve('账户添加成功！')
                    })
            })
        )
    }

    Promise
        .all(funcArr)
        .then((result) => {
            res.status(200).json({ code: 'ok', msg: result })
        })
        .catch(err => {
            res.status(200).json({ code: 'error', msg: err })
        })


})

// 删除申请记录
router.post('/deleteRecords', checkToken(), (req, res, next) => {
    let ids = req.body.rowsId,
        num = 0,
        funcArr = []
    ids.forEach((item, i) => {
        funcArr.push(
            new Promise(function (resolve, reject) {
                rrm.deleteOne({ _id: item }, (err, data) => {
                    if (err) reject(err);
                    if (data.deletedCount == 1) {
                        num++
                    }
                    resolve(data)
                })
            })
        )
    })
    Promise
        .all(funcArr)
        .then((result) => {
            res.status(200).json({ code: 'ok', msg: result })
        })
        .catch(err => {
            throw err
        })
})

//获取用户total,用于分页
router.get('/getUsersCount', checkToken(), (req, res, next) => {
    um.countDocuments().exec((err, data) => {
        if (err) throw err
        res.status(200).json({ total: data })
    })
})

// 获取当前页用户
router.get('/getUsers', checkToken(), (req, res, next) => {
    const currentPage = parseInt(req.query.currentPage),
        pageSize = parseInt(req.query.pageSize)


    um.find().skip((currentPage - 1) * pageSize).limit(pageSize).exec((err, data) => {
        if (err) throw err
        res.status(200).json({ users: data })
    })

})

//通过手机号搜索有户
router.get('/searchUser',checkToken(),(req,res,next)=>{
    um.findOne({phone:req.query.phone},(err,data)=>{
        if(err) throw err
        res.status(200).json({user:data})
    })
})

//通过_id搜索有户
router.get('/searchUserById',checkToken(),(req,res,next)=>{
    um.findOne({_id:req.query.id},(err,data)=>{
        if(err) throw err
        res.status(200).json({user:data})
    })
})



module.exports = router;

