/**
 * Created by lukaijie on 16/8/8.
 */
var pool = require('../libs/mysql'),
    request = require('request'),
    utool = require('../libs/utool'),
    md5 = require('MD5'),
    code = require('../libs/errors').code,
    u = require('underscore'),
    redis = require('../libs/redis'),
    memcached = require('../libs/memcached').memchached,
    logger = require('../libs/logger');

/**
 * @method 获取我的所有服务
 * @author lukaijie
 * @datetime 16/5/19
 */
exports.index = function (req, res) {
    res.render('service/index', {
        user_name: req.session['user'].user_name,
        navs: [
            {
                name: '管理中心',
                url: ''
            },
            {
                name: '服务列表',
                url: '/serviceList'
            }
        ],
        menu: 'admin',
        submenu: 'admin_serverlist'
    });
}

/**
 * @method 查询所有的服务
 * @author lukaijie
 * @datetime 16/8/8
 */
exports.getServiceList = function (req, res) {
    var sqlInfo = {
        method: 'getServiceList',
        memo: '查询所有的服务',
        params: {
            c_userid: req.session['user'].userid
        },
        desc: '查询所有的服务'
    }
    utool.sqlExect('SELECT * FROM t_service', null, sqlInfo, function (err, result1) {
        if (err) {
            logger.info('获取所有服务：' + JSON.stringify(err));
            res.send({
                status: '-1000',
                message: JSON.stringify(err)
            });
            return;
        }
        else {
            //查询t_app_service表
            var sqlInfo1 = {
                method: 'index',
                memo: '查询已经申请的服务',
                params: {
                    c_userid: req.session['user'].userid
                },
                desc: "查询t_user_service,是否有已经申请了服务"
            }
            utool.sqlExect('SELECT * FROM t_user_service WHERE c_userid = ?', [sqlInfo1.params.c_userid], sqlInfo1, function (err, result2) {
                if (err) {
                    logger.info('查询已经申请的服务：' + JSON.stringify(err));
                    res.send({
                        status: '-1000',
                        message: JSON.stringify(err)
                    });
                    return;
                }
                else {
                    u.each(result1, function (m, n) {
                        u.extend(m, {
                            c_apply_status: 0,    //应用是否拥有服务 0:未申请 1:申请中; 2:已获得
                            c_apply_time: '',     //申请日期
                            c_approval_time: ''   //审核日期
                        });
                    })

                    for (var i = 0; i < result1.length; i++) {
                        var data = u.where(result2, {c_serviceid: result1[i].c_serviceid});
                        if (data.length > 0) {
                            result1[i]['c_apply_status'] = data[0].c_service_status;
                            result1[i]['c_apply_time'] = data[0].c_apply_time;
                            result1[i]['c_approval_time'] = data[0].c_approval_time;
                        }
                    }
                    console.log(result1);
                    res.send({
                        status: '0000',
                        data: result1,
                        message: code['0000']
                    })
                }
            });
        }
    });
}

/**
 * @method 服务申请
 * @author lukaijie
 * @datetime 16/8/8
 */
exports.applyservice = function (req, res) {
    var applytime = new Date();
    var sqlInfo = {
        method: 'applyservice',
        memo: '服务申请',
        params: {
            c_userid: req.session['user'].userid,
            c_serviceid: req.body.serviceid,
            c_servicename: req.body.servicename,
            c_service_status: 1,
            c_apply_time: applytime
        },
        desc: '服务申请'
    }
    utool.sqlExect('INSERT INTO t_user_service SET ?', sqlInfo.params, sqlInfo, function (err, result) {
        if (err) {
            logger.info('服务申请：' + JSON.stringify(err));
            res.send({
                status: '-1000',
                message: JSON.stringify(err)
            });
        }
        else {
            var code = utool.randomString(32);
            //存入memcached
            memcached.set(code, {
                useid: sqlInfo.params.c_userid,
                serviceid: sqlInfo.params.c_serviceid,
                phone: req.session['user'].c_phone,
                email: req.session['user'].c_email,
                status: 0
            }, 300, function (err) {
                if (err) {
                    logger.info(err);
                }
            });
            logger.info('code: ' + code);
            redis.pub({
                customer: req.session['user'].customer,
                username: req.session['user'].username,
                phone: req.session['user'].c_phone,
                email: req.session['user'].c_email,
                service_name: sqlInfo.params.c_servicename,
                apply_datetime: applytime,
                approval_link: config.approval + '/approval?c=' + code
            })
            res.send({
                status: '0000',
                data: applytime,
                message: code['0000']
            });
        }
    });
}

/**
 * @method approval 审批服务
 * @author lukaijie
 * @datetime 16/8/8
 */
exports.approval = function (req, res) {
    var sqlInfo = {
        method: 'approval',
        memo: '审批服务申请',
        params: {
            c: req.query.c
        },
        desc: ""
    }
    console.log(req.query.c);
    //memcached查询是否有c
    memcached.get(sqlInfo.params.c, function (err, data) {
        if (err) {
            utool.errView(res, err);
        }
        if (data) {
            var approvaltime = new Date();
            utool.sqlExect('UPDATE t_user_service SET c_service_status = 2, c_approval_time = ? WHERE c_userid = ? AND c_serviceid = ?', [data.useid, data.serviceid, approvaltime], sqlInfo, function (err, result) {
                if (err) {
                    logger.info('审批服务申请：' + JSON.stringify(err));
                    utool.errView(res, err);
                }
                else {
                    //通知申请者审批成功

                    res.send('审批成功！')
                }
            });
        }
        else {
            res.send('该审批链接已经过时!');
        }
    })
}