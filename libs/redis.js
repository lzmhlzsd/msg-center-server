/**
 * Created by lukaijie on 16/5/30.
 */
var Redis = require('ioredis'),
    config = require('./config');
var redis = new Redis(config.redis);
var pub = new Redis(config.redis);
var email = require('./email');

redis.on('message', function (channel, message) {
    email.send_email(message)
    console.log('Receive message %s from channel %s', message, channel);
});

redis.subscribe('website_notify', 'music', function (err, count) {
    pub.publish('news', 'Hello World!');
});
exports.pub = function (mes) {
    console.log(mes)
    pub.publish('website_notify', JSON.stringify(mes));
}