/**
 * Created by lukaijie on 16/4/27.
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
    moment = require('moment'),
    fs = require('fs'),
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
            c_username: req.body.username,
            c_pwd: req.body.pwd
        },
        desc: ""
    }
    utool.sqlExect('SELECT * FROM t_user t1 LEFT JOIN t_config t2 on t1.c_userid = t2.c_userid WHERE c_username = ?', [sqlInfo.params.c_username], sqlInfo, function (err, result) {
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
                if (user.c_is_use == 1) {
                    if (user.c_pwd == md5(sqlInfo.params.c_pwd)) {
                        utool.sqlExect('SELECT t1.c_serviceid, t2.c_servicename FROM t_user_service t1\
                        LEFT JOIN t_service t2 on t1.c_serviceid = t2.c_serviceid where c_userid = ? AND c_service_status = 2', [user.c_userid], {c_userid: user.c_userid}, function (err, result1) {
                            if (err) {
                                res.send({
                                    status: '-1000',
                                    message: JSON.stringify(err)
                                });
                            }
                            else {
                                req.session['user'] = {
                                    customer: user.c_customer,
                                    username: user.c_username,
                                    userid: user.c_userid,
                                    usertype: user.c_type,
                                    appkey: user.c_appkey,
                                    appscrect: user.c_appscrect,
                                    pwd: user.c_pwd,
                                    phone: user.c_phone,
                                    email: user.c_email,
                                    userdesc: user.c_desc,
                                    //deadtime: user.c_type == 100 ? '永久' : moment(user.c_dead_time).format('YYYY-MM-DD HH:mm:ss'),
                                    qyh_cropid: user.c_weixin_qyh_cropid,
                                    qyh_screct: user.c_weixin_qyh_screct,
                                    qyh_agentid: user.c_weixin_qyh_agentid,   //企业应用ID
                                    serviceList: result1
                                }
                                res.send({
                                    status: '0000',
                                    message: code['0000']
                                });
                            }
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
                        status: '1006',
                        message: code['1006']
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
 * @method 控制台
 * @author lkj
 * @datetime 2016/7/26
 */
exports.index = function (req, res, next) {
    res.render('home/index', {
        session: req.session['user'],
        navs: [
            {
                name: '管理中心',
                url: ''
            },
            {
                name: '控制台',
                url: '/index'
            }
        ],
        menu: 'admin',
        submenu: 'admin_controller'
    });
}

/**
 * @method 注册
 * @author lukaijie
 * @datetime 16/8/8
 */
exports.signup = function (req, res) {
    res.render('signup');
}

/**
 * @method 检查账号是否已经存在
 * @author lukaijie
 * @datetime 16/8/8
 */
exports.checkUserName = function (req, res) {
    var sqlInfo = {
        method: 'checkUserName',
        memo: '检查账号是否已经存在',
        params: {
            appname: req.body.appname
        },
        desc: ""
    }
    console.log(sqlInfo)
    utool.sqlExect('SELECT COUNT(*) as counts FROM t_user WHERE c_username = ?',
        [sqlInfo.params.app_name], sqlInfo, function (err, result) {
            if (err) {
                logger.info('检查账号名称：' + JSON.stringify(err));
                res.send({
                    status: '-1000',
                    message: JSON.stringify(err)
                });
                return;
            }
            else {
                console.log(result[0].counts);
                if (result[0].counts == 0) {
                    //注册成功
                    res.send({
                        status: '0000',
                        message: code['0000']
                    });
                }
                else {
                    res.send({
                        status: '1003',
                        message: code['1003']
                    });
                }
            }
        });
}

/**
 * @method 注册提交
 * @author lukaijie
 * @datetime 16/8/8
 */
exports.register = function (req, res) {
    var registdate = new Date();
    var sqlInfo = {
        method: 'register',
        memo: '注册提交',
        params: {
            c_customer: req.body.customer,
            c_username: req.body.username,
            c_type: 1,
            c_pwd: md5(req.body.pwd),
            c_is_use: 1,
            c_phone: req.body.phone,
            c_email: req.body.email,
            c_appkey: utool.randomString(10),
            c_appscrect: utool.randomString(32),
            c_create_time: moment(registdate).format('YYYY-MM-DD HH:mm:ss'),
            //c_dead_time: moment(registdate).add(1, 'years').format('YYYY-MM-DD HH:mm:ss'),
            c_desc: '账号'
        },
        desc: ""
    }
    utool.sqlExect('INSERT INTO t_user SET ?', sqlInfo.params, sqlInfo, function (err, result) {
        if (err) {
            logger.info('注册账号：' + JSON.stringify(err));
            if (err.errno == 1062) {
                res.send({
                    status: '1005',
                    message: code['1005']
                });
            }
            else {
                res.send({
                    status: '-1000',
                    message: JSON.stringify(err)
                });
            }
        }
        else {
            redis.pub_signup({
                customer: sqlInfo.params.c_customer,
                username: sqlInfo.params.c_username,
                phone: sqlInfo.params.c_phone,
                email: sqlInfo.params.c_email,
                apply_datetime: new Date()
            })
            res.send({
                status: '0000',
                message: code['0000']
            });
        }
    });
}

/**
 * @method 退出系统
 * @author lukaijie
 * @datetime 16/8/8
 */
exports.logout = function (req, res) {
    delete req.session['user'];
    res.redirect('/');
}

/**
 * @method 获取今日数据
 * @author lukaijie
 * @datetime 16/9/2
 */
exports.getTodayData = function (req, res) {
    var now = moment();
    var startdate = now.format('YYYY-MM-DD');
    var enddate = now.add(1, 'days').format('YYYY-MM-DD');
    var sqlInfo = {
        method: 'getTodayData',
        memo: '获取今日数据',
        params: {
            startdate: startdate,
            enddate: enddate,
            c_appkey: req.session['user'].appkey
        },
        desc: ""
    }
    utool.sqlExect('SELECT c_create_time,COUNT(c_create_time)\
    FROM t_notice_log  where  c_create_time >= ? and c_create_time < ? and c_appkey = ? \
    group by c_create_time',
        [sqlInfo.params.startdate, sqlInfo.params.enddate, sqlInfo.params.c_appkey], sqlInfo, function (err, result) {
            if (err) {
                logger.info('获取今日数据：' + JSON.stringify(err));
                res.send({
                    status: '-1000',
                    message: JSON.stringify(err)
                });
                return;
            }
            else {
                var sqlInfo1 = {
                    method: 'getTodayData',
                    memo: '查询今日统计数据',
                    params: {
                        startdate: startdate
                    },
                    desc: ""
                }
                utool.sqlExect('SELECT * FROM t_notice_total where c_date = ?',
                    [sqlInfo1.params.startdate], sqlInfo1, function (err, result1) {
                        if (err) {
                            logger.info('查询今日统计数据：' + JSON.stringify(err));
                            res.send({
                                status: '-1000',
                                message: JSON.stringify(err)
                            });
                            return;
                        }
                        else {
                            //今日数据 汇总数据 + 各消息的调用情况
                            var rdata = {
                                total: result.length,
                                wx_success: 0,
                                wx_fail: 0,
                                email_success: 0,
                                email_fail: 0,
                                msg_success: 0,
                                msg_fail: 0
                            }
                            if (result1.length > 0) {
                                rdata.wx_success = result1[0].c_weixin_success;
                                rdata.wx_fail = result1[0].c_weixin_fail;
                                rdata.email_success = result1[0].c_email_success;
                                rdata.email_fail = result1[0].c_email_fail;
                                rdata.msg_success = result1[0].c_msg_success;
                                rdata.msg_fail = result1[0].c_msg_fail;
                            }
                            res.send({
                                status: '0000',
                                data: rdata,
                                message: code['0000']
                            })
                        }
                    });
            }
        });
}