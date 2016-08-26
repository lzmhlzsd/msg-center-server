/**
 * Created by lukaijie on 16/8/25.
 */
var pool = require('../libs/mysql'),
    request = require('request'),
    utool = require('../libs/utool'),
    config = require('../libs/config'),
    code = require('../libs/errors').code,
    md5 = require('MD5'),
    u = require('underscore'),
    redis = require('../libs/redis'),
    memcached = require('../libs/memcached').memchached,
    fs = require('fs'),
    logger = require('../libs/logger');

/**
 * @method 模板页面
 * @author lukaijie
 * @datetime 16/5/12
 */
exports.index = function (req, res, next) {
    res.render('noticelog/index', {
        session: req.session['user'],
        navs: [
            {
                name: '管理中心',
                url: ''
            },
            {
                name: '消息日志',
                url: '/noticelog'
            }
        ],
        menu: 'admin',
        submenu: 'admin_log'
    });
}