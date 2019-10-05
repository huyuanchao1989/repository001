const Core = require('@alicloud/pop-core');
const { accessKeyId, accessKeySecret } = require('../../config/keys')

var client = new Core({
    accessKeyId: accessKeyId,
    accessKeySecret: accessKeySecret,
    endpoint: 'https://dysmsapi.aliyuncs.com',
    apiVersion: '2017-05-25'
});


module.exports = (opt) => {
    const RegionId = opt.RegionId || 'cn-hangzhou',
        method = opt.method || 'POST',
        action = opt.action || 'SendSms',
        resolve = opt.resolve,  // 消息发送成功时的回调
        reject = opt.reject     // 消息发送失败时的回调

    const params = {
        'RegionId': RegionId,
        'PhoneNumbers': opt.PhoneNumbers,   // 主要
        'SignName': opt.SignName,           // 主要
        'TemplateCode': opt.TemplateCode,   // 主要
        'TemplateParam': opt.TemplateParam  // 主要
    }

    client.request(action, params, method)
        .then((result) => {
            resolve(result)
        }, (ex) => {
            reject(ex)
        })
}
