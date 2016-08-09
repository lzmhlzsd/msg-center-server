/**
 * Created by lkj on 2016/8/9.
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
    res.render('setup/index', {
        user_name: req.session['user'].username,
        navs: [
            {
                name: '管理中心',
                url: ''
            },
            {
                name: '设置中心',
                url: '/setup'
            }
        ],
        menu: 'admin',
        submenu: 'admin_setup'
    });
}