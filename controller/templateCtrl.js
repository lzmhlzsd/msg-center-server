/**
 * Created by lkj on 2016/8/7.
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
    res.render('template/index', {
        user_name: req.session['user'].user_name,
        menu: 'template'
    });
}

/**
 * @method 创建新模板
 * @author lkj
 * @datetime 2016/8/7
 */
exports.create = function (req, res) {
    res.render('template/newtemplate', {
        user_name: req.session['user'].user_name,
        menu: 'template'
    });
}