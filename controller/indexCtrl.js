/**
 * Created by lukaijie on 16/4/27.
 */

var pool = require('../libs/mysql'),
    request = require('request'),
    utool = require('../libs/utool'),
    config = require('../libs/config'),
    code = require('../libs/errors').code,
    md5 = require('MD5'),
    u = require('underscore');
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
                        app_num: user.app_num, //可创建应用数
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