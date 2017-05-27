var pool = require('../libs/mysql'),
    request = require('request'),
    utool = require('../libs/utool'),
    config = require('../libs/config'),
    code = require('../libs/errors').code,
    md5 = require('MD5'),
    u = require('underscore'),
    redis = require('../libs/redis'),
    memcached = require('../libs/memcached').memchached,
    logger = require('../libs/logger');

var API = require('wechat-enterprise').API;


/**
 * @method 大屏配置界面
 * @author lukaijie
 * @datetime 16/5/12
 */
exports.index = function(req, res, next) {
    res.render('bigScreen/index', {
        session: req.session['user'],
        navs: [{
            name: '大屏管理',
            url: ''
        }, {
            name: '组织设置',
            url: '/organization'
        }],
        menu: 'bigScreen',
        submenu: 'bigScreen_index'
    });
}


exports.getdata = function(req, res, next) {
    var SqlInfo = {
        method: 'getdata',
        memo: '查询所有的公司信息',
        params: {},
        desc: ''
    }
    utool.sqlExect('select * from t_v_company_info where c_userid = ?', [req.session['user'].userid], SqlInfo, function(err, result) {
        if (err) {
            res.send({
                status: '-1000',
                message: err.toString()
            })
            return;
        } else {
            res.send({
                status: '0000',
                data: {
                    datasouce: result
                },
                message: code['0000']
            })
        }
    });
}

/**
 * @method 添加配置信息
 * @author lukaijie
 * @datetime 16/5/12
 */
exports.new = function(req, res, next) {
    res.render('bigScreen/new', {
        session: req.session['user'],
        navs: [{
            name: '大屏管理',
            url: ''
        }, {
            name: '组织设置',
            url: '/organization'
        }],
        menu: 'bigScreen',
        submenu: 'bigScreen_index'
    });
}

/**
 * @method 保存配置信息
 * @author lukaijie
 * @datetime 16/5/12
 */
exports.save = function(req, res, next) {
    res.render('bigScreen/index', {
        session: req.session['user'],
        navs: [{
            name: '大屏管理',
            url: ''
        }, {
            name: '组织设置',
            url: '/organization'
        }],
        menu: 'bigScreen',
        submenu: 'bigScreen_index'
    });
}
