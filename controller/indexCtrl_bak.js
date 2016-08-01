/**
 * Created by lkj on 2016/7/30.
 */
/**
 * Created by lukaijie on 16/4/27.
 */

var pool = require('../libs/mysql'),
    request = require('request'),
    utool = require('../libs/utool'),
    config = require('../libs/config'),
    code = require('../libs/errors').code,
    md5 = require('MD5'),
    logger = require('../libs/logger');

/**
 * @method 主页面
 * @author lukaijie
 * @datetime 16/5/12
 */
exports.login = function (req, res, next) {
    var sqlInfo = {
        method: 'login',
        memo: '登录系统',
        params: {
            user_name: req.body.user_name,
            pwd: req.body.pwd
        },
        desc: ""
    }
    utool.sqlExect('SELECT * FROM t_user WHERE user_name= ?', [sqlInfo.params.user_name], sqlInfo, function (err, result) {
        if (err) {
            logger.info('根据用户名查询失败：' + JSON.stringify(err));
            res.send({
                status: '-1000',
                message: JSON.stringify(err)
            });
        }
        else {
            if (result.length > 0) {
                var user = result[0];
                if (user.pwd == md5(sqlInfo.params.pwd)) {
                    req.session['user'] = {
                        user_name: user.user_name,
                        user_id: user.user_id,
                        pwd: user.pwd
                    }
                    res.send({
                        status: '0000',
                        message: code['0000']
                    });
                }
                else {
                    res.send({
                        status: '1002',
                        message: code['1002']
                    });
                }
            }
            else {
                res.send({
                    status: '1001',
                    message: code['1001']
                });
            }
        }
    });
}

/**
 * @method 主页面
 * @author lkj
 * @datetime 2016/7/26
 */
exports.index = function (req, res, next) {
    res.render('home/index', {
        user_name: req.session['user'].user_name,
        menu: 'myapp'
    });
}

/**
 * @method 校验应用名称
 * @author lkj
 * @datetime 2016/7/26
 */
exports.checkName = function (req, res) {
    //同一账号下的应用名称不能重复
    checkAppName(req.body.user_id, req.body.app_name, function (data) {
        if (data) {
            res.send({
                status: '1003',
                message: code['1003']
            });
        }
        else {
            res.send({
                status: '0000',
                message: code['0000']
            });
        }
    })
}

/**
 * @method 新增应用
 * @author lkj
 * @datetime 2016/7/26
 */
exports.createApp = function (req, res) {
    var sqlInfo = {
        method: 'createApp',
        memo: '新增应用',
        params: {
            app_name: req.body.app_name,
            app_key: utool.randomString(7),
            app_screct: utool.randomString(20),
            user_id: req.session['user'].user_id,
            app_memo: req.body.app_memo
        },
        desc: ""
    }
    checkAppName(req.body.user_id, req.body.app_name, function (data) {
        if (data) {
            res.send({
                status: '1003',
                message: code['1003']
            });
        }
        else {
            utool.sqlExect('INSERT INTO t_app SET ?', sqlInfo.params, sqlInfo, function (err, result) {
                if (err) {
                    logger.info('新增应用：' + JSON.stringify(err));
                    utool.errView(res, err);
                }
                else {
                    res.redirect('/index');
                }
            });
        }
    })


}
/**
 * @method 新增应用页面
 * @author lkj
 * @datetime 2016/7/26
 */
exports.newapp = function (req, res) {
    res.render('app/newapp', {
        user_name: req.session['user'].user_name,
        menu: 'myapp'
    });
}

/**
 * @method 根据shopexid获取所有的服务
 * @author lukaijie
 * @datetime 16/5/13
 */
exports.apis = function (req, res) {
    if (utool.checkSession(req.session)) {
        //查询服务
        var shopexid = req.session['shopexid'];
        var ErrInfo = {
            method: 'apis',
            memo: '查询所有的全平台可见并且是已经上线的服务',
            params: {fd_shopexid: shopexid}
        }
        utool.sqlExect('SELECT * FROM t_service WHERE fd_visible= ? AND fd_status= ? ORDER BY fd_create_time DESC', [1, 4], ErrInfo, function (err, result) {
            if (err) {
                utool.errView(res, err);
            }
            else {
                if (result.length > 0) {
                    res.redirect('/apis/db/' + result[0].fd_serviceid);
                    return;
                }
                res.render('home/index', {title: 'index', apis: result, uid: req.session['fd_uid']});
            }
        });
    }
    else {
        res.redirect('/');
    }
}

/**
 * @method 根据服务id查询所有的服务列表
 * @author lukaijie
 * @datetime 16/5/13
 */
exports.apisOfService = function (req, res) {
    //查询所有的已上线并且全平台可见的服务
    var ErrInfo = {
        method: 'apisOfService',
        memo: '根据服务id查询所有的服务列表',
        params: {fd_serviceid: req.params.sid}
    }
    utool.sqlExect('SELECT * FROM t_service WHERE fd_visible= ? AND fd_status= ? ORDER BY fd_create_time DESC', [1, 4], ErrInfo, function (err, result) {
        if (err) {
            utool.errView(res, err);
        }
        else {
            var ErrInfo = {
                method: 'apisOfService',
                memo: '根据服务id查询服务明细',
                params: {fd_serviceid: req.params.sid}
            }
            var servicelist = result;
            utool.sqlExect('SELECT * FROM t_service WHERE fd_serviceid=? AND fd_visible= ? AND fd_status= ? ORDER BY fd_create_time DESC', [req.params.sid, 1, 4], ErrInfo, function (err, result) {
                if (err) {
                    utool.errView(res, err);
                }
                else {
                    var service;
                    try {
                        service = JSON.parse(result[0].fd_config);
                    }
                    catch (e) {
                        service = {};
                    }
                    res.render('home/apilist', {
                        list: servicelist,
                        service: service,
                        serviceid: req.params.sid,
                        uid: req.session['fd_uid']
                    });
                }
            });
        }
    });

}

/**
 * @method detailOfApi
 * @author lukaijie
 * @datetime 16/5/27
 */
exports.detailOfApi = function (req, res) {
    var ErrInfo = {
        method: 'detailOfApi',
        memo: '根据fd_serviceid查询api明细',
        params: {fd_serviceid: req.params.sid}
    }
    utool.sqlExect('SELECT * FROM t_service WHERE fd_serviceid=? AND fd_visible= ? AND fd_status= ? ORDER BY fd_create_time DESC', [req.params.sid, 1, 4], ErrInfo, function (err, result) {
        if (err) {
            utool.errView(res, err);
        }
        else {
            var service;
            try {
                service = JSON.parse(result[0].fd_config);
            }
            catch (e) {
                service = {};
            }
            res.render('home/apidetail', {
                service: service,
                serviceid: req.params.sid,
                uid: req.session['fd_uid'],
                rapi: req.query.api
            });
        }
    });
}

/**
 * @method 检查数据库中是否有shopexid,如果没有插入一条新的数据
 * @author lukaijie
 * @datetime 16/5/13
 */
function checkShopexId(shopexid, obj, res) {
    var ErrInfo = {
        method: 'checkShopexId',
        memo: '根据shopexid查询用户信息',
        params: {fd_shopexid: shopexid}
    }
    utool.sqlExect('SELECT * FROM t_user WHERE fd_shopexid= ?', shopexid, ErrInfo, function (err, result) {
        if (err) {
            utool.errView(res, err);
        }
        else {
            if (result.length == 0) {
                var data = {
                    fd_uid: obj.shopexid,           //  --  用户id，应通过序号表获得
                    fd_utype: 2,                    //  --  用户类型，1-普通用户，2-开发者用户， 100-管理员
                    fd_uname: obj.realName,         //  --  用户名字
                    fd_account: obj.username,       //  --  用户账号
                    fd_shopexid: obj.shopexid,      //  --  商派shopexid，商派统一登录时用
                    fd_account_type: 1,             //  --  账户类型 1-为shopexid， 2-为平台注册用户
                    fd_last_time: new Date()        //  --  最后登录时间
                }
                var ErrInfo = {
                    method: 'checkShopexId',
                    memo: '检查数据库中是否有shopexid,如果没有插入一条新的数据',
                    params: data
                }
                utool.sqlExect('INSERT INTO t_user SET ?', data, ErrInfo, function (err, result) {
                    if (err) {
                        utool.errView(res, err);
                    }
                });
            }
        }
    });
}

/**
 * @method 检查应用名称是否存在
 * @author lkj
 * @datetime 2016/7/30
 */
function checkAppName(userid, appname, callback) {
    var sqlInfo = {
        method: 'checkAppName',
        memo: '检查应用名称是否存在',
        params: {
            app_name: appname,
            user_id: userid
        },
        desc: "同一账号下的应用名称不能重复"
    }
    utool.sqlExect('SELECT COUNT(*) as counts FROM t_app WHERE user_id = ? AND app_name = ?', [sqlInfo.params.user_id, sqlInfo
        .params.app_name], sqlInfo, function (err, result) {
        if (err) {
            logger.info('校验应用名称：' + JSON.stringify(err));
            //utool.errView(res, err);
            res.send({
                status: '-1000',
                message: JSON.stringify(err)
            });
            return;
        }
        else {
            if (result[0].counts == 0) {
                callback(false)
            }
            else {
                callback(true);
            }
        }
    });
}