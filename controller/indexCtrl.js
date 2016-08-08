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
    utool.sqlExect('SELECT * FROM t_user WHERE c_username = ?', [sqlInfo.params.c_username], sqlInfo, function (err, result) {
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
                if (user.c_pwd == md5(sqlInfo.params.c_pwd)) {
                    req.session['user'] = {
                        customer: user.c_customer,
                        username: user.c_username,
                        userid: user.c_userid,
                        appkey: user.c_appkey,
                        appscrect: user.c_appscrect,
                        pwd: user.c_pwd,
                        phone: user.c_phone,
                        email: user.c_email
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
 * @method 控制台
 * @author lkj
 * @datetime 2016/7/26
 */
exports.index = function (req, res, next) {
    res.render('home/index', {
        user_name: req.session['user'].user_name,
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
//exports.index = function (req, res, next) {
//    res.render('home/index', {
//        user_name: req.session['user'].user_name,
//        navs: [
//            {
//                name: '管理中心',
//                url: ''
//            },
//            {
//                name: '服务列表',
//                url: '/serviceList'
//            }
//        ],
//        menu: 'admin',
//        submenu: 'admin_serverList'
//    });
//}

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
            c_desc: '普通账号'
        },
        desc: ""
    }
    utool.sqlExect('INSERT INTO t_user SET ?', sqlInfo.params, sqlInfo, function (err, result) {
        if (err) {
            logger.info('注册账号：' + JSON.stringify(err));
            res.send({
                status: '-1000',
                message: JSON.stringify(err)
            });
        }
        else {
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


//****************************************************


/**
 * @method 校验应用名称
 * @author lkj
 * @datetime 2016/7/26
 */
exports.checkName = function (req, res) {
    //同一账号下的应用名称不能重复
    checkAppName(req.session['user'].user_id, req.body.app_name, function (data) {
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
 * @method 校验可创建应用数
 * @author lkj
 * @datetime 2016/7/31
 */
exports.checkappNum = function (req, res) {
    var sqlInfo = {
        method: 'getAppList',
        memo: '分页查询所有的应用',
        params: {
            user_id: req.session['user'].user_id,
            app_num: req.session['user'].app_num
        },
        desc: '查询应用总数'
    }
    utool.sqlExect('SELECT COUNT(*) as counts FROM t_app WHERE user_id = ?', req.params.user_id, sqlInfo, function (err, result) {
        if (err) {
            logger.info('分页查询所有的应用：' + JSON.stringify(err));
            res.send({
                status: '-1000',
                message: JSON.stringify(err)
            });
            return;
        }
        else {
            if (sqlInfo.params.app_num < result[0].counts) {
                res.send({
                    status: '0000',
                    message: code('0000')
                });
            }
            else {
                res.send({
                    status: '1004',
                    message: code('1004')
                });
            }
        }
    });
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
            app_id: utool.randomString(8),
            app_name: req.body.app_name,
            app_key: utool.randomString(7),
            app_screct: utool.randomString(20),
            user_id: req.session['user'].user_id,
            app_memo: req.body.app_memo
        },
        desc: ""
    }
    checkAppName(req.session['user'].user_id, req.body.app_name, function (data) {
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
        app_num: req.session['user'].app_num,
        menu: 'myapp'
    });
}

/**
 * @method 分页查询所有的应用
 * @author lkj
 * @datetime 2016/7/30
 */
exports.getAppList = function (req, res) {
    //分页查询
    var sqlInfo = {
        method: 'getAppList',
        memo: '分页查询所有的应用',
        params: {
            user_id: req.session['user'].user_id,
            pagesize: req.body.pagesize,
            pagenum: req.body.pagenum,
            filters: typeof req.body.filters == 'undefined' ? {} : req.body.filters
        },
        desc: '查询应用总数'
    }
    var wherestr = '';
    var filters = sqlInfo.params.filters;
    if (typeof filters.filter != 'undefined') {
        u.each(filters.filter, function (m, n) {
            switch (m.Operator) {
                case 'like':
                    wherestr += ' AND ' + m.field + ' ' + m.Operator + " '%" + m.value + "%' ";
                    break;
            }
        })
    }
    console.log('SELECT COUNT(*) as counts FROM t_app WHERE user_id = ?' + wherestr);
    utool.sqlExect('SELECT COUNT(*) as counts FROM t_app WHERE user_id = ?' + wherestr, sqlInfo.params.user_id, sqlInfo, function (err, result) {
        if (err) {
            logger.info('分页查询所有的应用：' + JSON.stringify(err));
            res.send({
                status: '-1000',
                message: JSON.stringify(err)
            });
            return;
        }
        else {
            var count = result[0].counts;
            console.log(count);
            var pages = Math.ceil(count / sqlInfo.params.pagesize);

            var sqlInfo1 = {
                method: 'getAppList',
                memo: '分页查询所有的应用',
                params: {
                    user_id: req.session['user'].user_id,
                    pagesize: req.body.pagesize,
                    pagenum: req.body.pagenum,
                    filters: typeof req.body.filters == 'undefined' ? {} : req.body.filters
                },
                desc: '分页查询所有的应用'
            }

            var pageindex = (sqlInfo1.params.pagenum - 1) * sqlInfo1.params.pagesize;
            console.log('sql:' + 'SELECT * FROM t_app WHERE user_id = ' + sqlInfo1.params.user_id + wherestr + ' ORDER BY app_createtime DESC LIMIT ' + pageindex + ',' + sqlInfo1.params.pagesize);
            utool.sqlExect('SELECT app_id,app_name,app_key,app_status,app_creattime,app_memo FROM t_app WHERE user_id = ? ' + wherestr + ' ORDER BY app_creattime DESC LIMIT ?,?', [sqlInfo1.params.user_id, pageindex, sqlInfo1.params.pagesize], sqlInfo1, function (err, result1) {
                if (err) {
                    logger.info('分页查询所有的应用：' + JSON.stringify(err));
                    res.send({
                        status: '-1000',
                        message: JSON.stringify(err)
                    });
                    return;
                }
                else {
                    res.send({
                        status: '0000',
                        data: {
                            datasource: result1,
                            pagesize: sqlInfo1.params.pagesize,
                            pagenum: sqlInfo1.params.pagenum,
                            pages: pages
                        },
                        message: code['0000']
                    });
                }
            });
        }
    });
}

/**
 * @method 编辑应用页面
 * @author lkj
 * @datetime 2016/7/31
 */
exports.editapp = function (req, res) {
    var sqlInfo = {
        method: 'editapp',
        memo: '编辑应用页面',
        params: {
            user_id: req.session['user'].user_id,
            app_id: req.params.id //app id
        },
        desc: "根据应用id查询应用"
    }
    console.log(sqlInfo)
    utool.sqlExect('SELECT app_id,app_name,app_memo FROM t_app WHERE user_id = ? AND app_id = ?', [sqlInfo.params.user_id,
        sqlInfo.params.app_id], sqlInfo, function (err, result) {
        if (err) {
            logger.info('编辑应用页面：' + JSON.stringify(err));
            //utool.errView(res, err);
            res.send({
                status: '-1000',
                message: JSON.stringify(err)
            });
            return;
        }
        else {
            if (result.length == 0) {
                res.redirect('/index');
            }
            else {
                res.render('app/editapp', {
                    user_name: req.session['user'].user_name,
                    app_id: result[0].app_id,
                    app_name: result[0].app_name,
                    app_memo: result[0].app_memo,
                    menu: 'myapp'
                });
            }
        }
    });
}

/**
 * @method 更新app
 * @author lukaijie
 * @datetime 16/8/3
 */
exports.updateApp = function (req, res) {
    var sqlInfo = {
        method: 'updateApp',
        memo: '更新应用',
        params: {
            app_id: req.body.app_id,
            app_name: req.body.app_name,
            user_id: req.session['user'].user_id,
            app_memo: req.body.app_memo
        },
        desc: ""
    }
    checkAppName(req.session['user'].user_id, req.body.app_name, function (data) {
        if (data) {
            res.send({
                status: '1003',
                message: code['1003']
            });
        }
        else {
            utool.sqlExect('UPDATE t_app SET app_name = ?, app_memo = ? WHERE app_id = ?', [sqlInfo.params.app_name, sqlInfo.params.app_memo, sqlInfo.params.app_id], sqlInfo, function (err, result) {
                if (err) {
                    logger.info('更新应用：' + JSON.stringify(err));
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
 * @method 应用概览
 * @author lukaijie
 * @datetime 16/8/3
 */
exports.viewapp = function (req, res) {
    var sqlInfo = {
        method: 'viewapp',
        memo: '查看应用明细',
        params: {
            user_id: req.session['user'].user_id,
            app_id: req.params.id //app id
        },
        desc: "查询已经发布的所有服务"
    }
    utool.sqlExect('SELECT * FROM t_app WHERE app_id = ?', [sqlInfo.params.app_id], sqlInfo, function (err, result) {
        if (err) {
            logger.info('查看应用明细：' + JSON.stringify(err));
            res.send({
                status: '-1000',
                message: JSON.stringify(err)
            });
            return;
        }
        else {
            utool.sqlExect('SELECT * FROM t_service WHERE service_status = ?', [1], sqlInfo, function (err, result1) {
                if (err) {
                    logger.info('查看应用明细：' + JSON.stringify(err));
                    res.send({
                        status: '-1000',
                        message: JSON.stringify(err)
                    });
                    return;
                }
                else {
                    //查询t_app_service表
                    var sqlInfo1 = {
                        method: 'viewapp',
                        memo: '查看应用明细',
                        params: {
                            app_id: req.params.id
                        },
                        desc: "查询t_app_service,是否有app已经申请了服务"
                    }
                    utool.sqlExect('SELECT * FROM t_app_service WHERE app_id = ?', [sqlInfo1.params.app_id], sqlInfo1, function (err, result2) {
                        if (err) {
                            logger.info('查看应用明细：' + JSON.stringify(err));
                            res.send({
                                status: '-1000',
                                message: JSON.stringify(err)
                            });
                            return;
                        }
                        else {
                            //console.log(result1.length)
                            //if (result1.length == 0) {
                            //    utool.errView(res, 'not found', 404);
                            //    return;
                            //}

                            u.each(result1, function (m, n) {
                                u.extend(u, {app_status: 0}); //应用是否拥有服务 0:未申请 1:已获得
                            })

                            for (var i = 0; i < result1.length; i++) {
                                var data = u.where(result2, {service_id: result1[i].service_id});
                                if (data.length > 0) {
                                    result1[i]['app_status'] = data[0].apply_status;
                                }
                                else {
                                    result1[i]['app_status'] = 0;
                                }
                            }
                            //console.log(result)
                            res.render('app/appdetail', {
                                app: result[0],
                                service: result1,
                                app_id: sqlInfo.params.app_id,
                                user_name: req.session['user'].user_name,
                                app_num: req.session['user'].app_num,
                                menu: 'myapp'
                            });
                        }
                    });
                }
            });
        }
    });

}

/**
 * @method apply
 * @author lukaijie
 * @datetime 16/8/4
 */
exports.apply = function (req, res) {
    //申请服务
    var sqlInfo = {
        method: 'apply',
        memo: '申请服务',
        params: {
            service_id: req.body.service_id,
            app_id: req.body.app_id,
            apply_status: 1,
            apply_datetime: new Date()
        },
        desc: "申请服务"
    }
    utool.sqlExect('INSERT INTO t_app_service SET ?', [sqlInfo.params], sqlInfo, function (err, result) {
        if (err) {
            logger.info('申请服务：' + JSON.stringify(err));
            res.send({
                status: '-1000',
                message: JSON.stringify(err)
            });
            return;
        }
        else {
            //
            utool.sqlExect('SELECT * FROM t_app where app_id = ?', [sqlInfo.params.app_id], sqlInfo, function (err, result1) {
                if (err) {
                    logger.info('申请服务：' + JSON.stringify(err));
                    res.send({
                        status: '-1000',
                        message: JSON.stringify(err)
                    });
                    return;
                }
                else {
                    utool.sqlExect('SELECT * FROM t_service where service_id = ?', [sqlInfo.params.service_id], sqlInfo, function (err, result2) {
                        if (err) {
                            logger.info('申请服务：' + JSON.stringify(err));
                            res.send({
                                status: '-1000',
                                message: JSON.stringify(err)
                            });
                            return;
                        }
                        else {
                            var code = utool.randomString(32);
                            //存入memcached
                            memcached.set(code, {
                                app_id: sqlInfo.params.app_id,
                                service_id: sqlInfo.params.service_id,
                                status: 0
                            }, 300, function (err) {
                                if (err) {
                                    logger.info(err);
                                }
                            });
                            //fs.writeFileSync('message.txt', code);
                            logger.info('code: ' + code);
                            redis.pub({
                                user_id: req.session['user'].user_name,
                                app_name: result1[0].app_name,
                                service_name: result2[0].service_name,
                                apply_datetime: sqlInfo.params.apply_datetime,
                                approval_link: config.approval + '/approval?c=' + code
                            })
                            res.send({
                                status: '0000',
                                message: code['0000']
                            })
                        }
                    });
                }
            });

        }
    });
}

/**
 * @method approval 审批应用
 * @author lkj
 * @datetime 2016/8/6
 */
exports.approval = function (req, res) {
    var sqlInfo = {
        method: 'approval',
        memo: '审批应用',
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
            utool.sqlExect('UPDATE t_app_service SET apply_status = 2 WHERE app_id = ? AND service_id = ?', [data.app_id, data.service_id], sqlInfo, function (err, result) {
                if (err) {
                    logger.info('审批应用申请：' + JSON.stringify(err));
                    utool.errView(res, err);
                }
                else {
                    res.send('审批成功！')
                }
            });
        }
        else {
            res.send('该审批链接已经过时!');
        }
    })
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
    console.log(sqlInfo)
    utool.sqlExect('SELECT COUNT(*) as counts FROM t_app WHERE user_id = ? AND app_name = ?', [sqlInfo.params.user_id,
        sqlInfo.params.app_name], sqlInfo, function (err, result) {
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
            console.log(result[0].counts)
            if (result[0].counts == 0) {
                callback(false)
            }
            else {
                callback(true);
            }
        }
    });
}