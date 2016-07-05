/**
 * Created by lukaijie on 16/4/27.
 */

var pool = require('../libs/mysql'),
    request = require('request'),
    utool = require('../libs/utool'),
    config = require('../libs/config'),
    logger = require('../libs/logger');

/**
 * @method 主页面
 * @author lukaijie
 * @datetime 16/5/12
 */
exports.oauth = function (req, res, next) {
    var params = {
        code: req.query.code,
        client_id: config.oauth.client_id,
        client_secret: config.oauth.client_secret
    }
    //session中没有shopexid
    if (!utool.checkSession(req.session)) {
        //request.post('https://openapi.shopex.cn/oauth/token?grant_type=authorization_code&code=' + params.code + '&client_id=' + params.client_id + '&client_secret=' + params.client_secret, function (error, response, result) {
        //    result = JSON.parse(result);
        //    if (result.result == 'error') { //oauth服务器返回错误
        //        res.redirect('/');
        //        return;
        //    }
        //    utool.reqErr(error, response, res, result, function () {
        //        req.session['shopexid'] = result.data.shopexid;
        //        req.session['fd_uid'] = result.data.shopexid;
        //        req.session['realName'] = result.data.realName;
        //        req.session['username'] = result.data.username;
        //        checkShopexId(result.data.shopexid, req.session, res);
        //        res.redirect('/apis');
        //    })
        //});



                req.session['shopexid'] = '13917609856';
                req.session['fd_uid'] = '13917609856';
                req.session['realName'] = '';
                req.session['username'] = '';
                checkShopexId('13917609856', req.session, res);
                res.redirect('/apis');
    }
    else {
        checkShopexId(req.session.shopexid, req.session, res);
        res.redirect('/apis');
    }
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
                if(result.length > 0){
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
                    res.render('home/apilist', {list: servicelist, service: service, serviceid: req.params.sid, uid: req.session['fd_uid']});
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
            res.render('home/apidetail', {service: service,  serviceid: req.params.sid, uid: req.session['fd_uid'], rapi: req.query.api});
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