/**
 * Created by lkj on 2016/8/5.
 */
var nodemailer = require('nodemailer'),
    moment = require('moment');

var transporter = nodemailer.createTransport({
    host: "smtp.qq.com", // 主机
    secureConnection: true, // 使用 SSL
    port: 465, // SMTP 端口
    auth: {
        user: "332847979@qq.com", // 账号
        pass: "cyokedaiptaicacf" // 密码
    }
});

//var mailOptions = {
//    from: '332847979@qq.com ', // sender address
//    to: 'lukaijie2006@sina.com', // list of receivers
//    subject: 'Hello ✔', // Subject line
//    text: 'Hello world ✔', // plaintext body
//    html: '<b>Hello world ✔</b>' // html body
//};


exports.send_email = function (msg) {
    var objmsg = JSON.parse(msg);
    var html = "<b>用户名称：" + objmsg.user_id + "</b><br>" +
        "<b>应用名称：" + objmsg.app_name + "</b><br>" +
        "<b>服务名称：" + objmsg.service_name + "</b><br>" +
        "<b>申请日期：" + moment(objmsg.apply_datetime).format("YYYY-MM-DD HH:mm:ss") + "</b><br>" +
        "<b>审批链接：<a href='" + objmsg.approval_link + "' target='_blank'>" + objmsg.approval_link + "</a></b>";

    var mailOptions = {
        from: '332847979@qq.com ', // sender address
        to: 'lukaijie2006@sina.com', // list of receivers
        subject: '应用申请', // Subject line
        text: objmsg.user_id + '(' + objmsg.service_name + ')', // plaintext body
        html: html // html body
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Message sent: ' + info.response);
        }
    });
}