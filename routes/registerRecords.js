// const express = require('express');
// const router = express.Router();
// const rrm = require("../mongodb_models/registerRecords.js")

// router.get('/registerRecords', (req, res, next) => {
//     if (req.query.type === 'pending') {
//         rrm.find({ 'registerState': '待处理' }, (err, data) => {
//             if (err) throw err;
//             if (!data) {
//                 res.status(404).send('没有待处理的申请记录！')
//             } else {
//                 res.status(200).send(data)
//             }
//         })
//     } else if (req.query.type === 'all') {
//         rrm.find({}, (err, data) => {
//             if (err) throw err;
//             if (!data) {
//                 res.status(404).send('请求的数据不存在 ！')
//             } else {
//                 res.status(200).send(data)
//             }
//         })
//     } else {
//         res.status(400).send('请求类型错误，只允许pending all ')
//     }
// })


// module.exports = router