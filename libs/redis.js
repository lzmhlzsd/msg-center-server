/**
 * Created by lukaijie on 16/5/30.
 */
var Redis = require('ioredis'),
    config = require('./config'),
    moment = require('moment'),
    u = require('underscore');
var redis = new Redis(config.redis);
var pub = new Redis(config.redis);
var email = require('./email');

redis.on('message', function (channel, message) {
    switch (channel) {
        case 'apply_notify':
            var objmsg = JSON.parse(message);
            var html = "<b>个人/组织：" + objmsg.customer + "</b><br>" +
                "<b>账号名称：" + objmsg.username + "</b><br>" +
                "<b>联系电话：" + objmsg.phone + "</b><br>" +
                "<b>电子邮箱：" + objmsg.email + "</b><br>" +
                "<b>服务名称：" + objmsg.service_name + "</b><br>" +
                "<b>申请日期：" + moment(objmsg.apply_datetime).format("YYYY-MM-DD HH:mm:ss") + "</b><br>" +
                "<b>审批链接：<a href='" + objmsg.approval_link + "' target='_blank'>" + objmsg.approval_link + "</a></b>";
            var mailOptions = {
                from: '332847979@qq.com ', // sender address
                to: 'lukaijie2006@sina.com', // list of receivers
                subject: '服务申请', // Subject line
                text: objmsg.customer + '(' + objmsg.service_name + ')', // plaintext body
                html: html // html body
            };
            email.send_email(mailOptions);
            break;
        case 'signup_notify':
            var objmsg = JSON.parse(message);
            var html = "<b>个人/组织：" + objmsg.customer + "</b><br>" +
                "<b>账号名称：" + objmsg.username + "</b><br>" +
                "<b>联系电话：" + objmsg.phone + "</b><br>" +
                "<b>电子邮箱：" + objmsg.email + "</b><br>" +
                "<b>注册日期：" + moment(objmsg.signup_datetime).format("YYYY-MM-DD HH:mm:ss") + "</b><br>";
            var mailOptions = {
                from: '332847979@qq.com ', // sender address
                to: 'lukaijie2006@sina.com', // list of receivers
                subject: '账号注册', // Subject line
                text: objmsg.customer + '(' + objmsg.username + ')', // plaintext body
                html: html // html body
            };
            email.send_email(mailOptions);
            break;
        case 'approval_notify':
            var objmsg = JSON.parse(message);
            u.templateSettings = {
                interpolate: /\{\{(.+?)\}\}/g
            };
            var template = u.template(
                '<b>{{username}}<b> 您好！\
                    您申请的 <b>{{service_name}}</b> 服务已审核通过，请登录平台查看！');
            var mailOptions = {
                from: '332847979@qq.com ', // sender address
                to: objmsg.email, // list of receivers
                subject: '服务审核', // Subject line
                text: '', // plaintext body
                html: template({
                    username: objmsg.username,
                    service_name: objmsg.service_name
                }) // html body
            };
            email.send_email(mailOptions);
            break;
    }
    console.log('Receive message %s from channel %s', message, channel);
});

redis.subscribe('apply_notify', 'music', function (err, count) {
    //pub.publish('news', 'Hello World!');
});
redis.subscribe('signup_notify', 'music', function (err, count) {
    //pub.publish('news', 'Hello World!');
});
redis.subscribe('approval_notify', 'music', function (err, count) {
    //pub.publish('news', 'Hello World!');
});
//服务申请通知
exports.pub = function (mes) {
    console.log(mes)
    pub.publish('apply_notify', JSON.stringify(mes));
}

//注册通知
exports.pub_signup = function (mes) {
    pub.publish('signup_notify', JSON.stringify(mes));
}

//审核通过通知
exports.pub_approval = function (mes) {
    pub.publish('approval_notify', JSON.stringify(mes));
}