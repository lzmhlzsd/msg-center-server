/**
 * Created by lukaijie on 16/8/15.
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
    logger = require('../libs/logger');

/**
 * @method 账号设置
 * @author lukaijie
 * @datetime 16/8/15
 */
exports.account = function (req, res) {
    res.render('system/account', {
        session: req.session['user'],
        navs: [
            {
                name: '系统管理',
                url: ''
            },
            {
                name: '账号管理',
                url: '/account'
            }
        ],
        menu: 'system',
        submenu: 'system_account'
    });
}

/**
 * @method 查询所有账号
 * @author lukaijie
 * @datetime 16/8/15
 */
exports.getAllAccount = function (req, res) {
    var SqlInfo = {
        method: 'getAllAccount',
        memo: '查询所有账号',
        params: {
            pagenum: req.body.pagenum,            //页码
            pagesize: req.body.pagesize,          //页大小
            searchParams: req.body.searchParams
        },
        desc: ''
    }
    //根据shopexid查询对应的应用,分页查询
    var pagesize = SqlInfo.params.pagesize;
    var pageindex = (SqlInfo.params.pagenum - 1) * pagesize;

    var wherestr = '';

    SqlInfo.params.searchParams.filters.push({
        filed: 'c_type', operator: 'neq', value: 100
    })

    var array = [];
    u.each(SqlInfo.params.searchParams.filters, function (m, n) {
        if (typeof m.filters == 'undefined') {
            switch (m.operator) {
                case 'like':
                    array.push(m.filed + " like '%" + m.value + "%'");
                    break;
                case 'eq':
                    array.push(m.filed + " = '" + m.value + "'");
                    break;
                case 'neq':
                    array.push(m.filed + " != " + m.value);
                    break;
            }
        }
        else {
            var sub_array = [];
            u.each(m.filters, function (a, b) {
                switch (a.operator) {
                    case 'eq':
                        sub_array.push(a.filed + " = " + a.value)
                        break;
                }
            })
            //sub_array.join(' ' + m.logic + ' ');
            if (sub_array.length > 1) {
                array.push('(' + sub_array.join(' ' + m.logic + ' ') + ')');
            }
            else if (sub_array.length == 1) {
                array.push(sub_array[0]);
            }
        }
    });
    if (array.length > 1) {
        wherestr = ' WHERE ' + array.join(' ' + SqlInfo.params.searchParams.logic + ' ');
    }
    else if (array.length == 1) {
        wherestr = ' WHERE ' + array.toString();
    }

    var sql1 = 'SELECT COUNT(*) AS counts FROM t_user';

    console.log('SQL1:----' + sql1 + wherestr);
    utool.sqlExect(sql1 + wherestr, null, SqlInfo, function (err, result) {
        if (err) {
            res.send({
                status: '-1000',
                message: err.toString()
            })
            return;
        }
        else {
            console.log('counts:' + result[0].counts);
            var count = result[0].counts;
            if (result[0].counts > 0) {
                var sql2 = 'SELECT * FROM t_user';

                console.log('SQL2:----' + sql2 + wherestr + ' ORDER BY c_create_time DESC LIMIT ' + pageindex + ',' + pagesize);
                utool.sqlExect(sql2 + wherestr + ' ORDER BY c_create_time DESC LIMIT ?,?', [pageindex, pagesize], SqlInfo, function (err, result1) {
                    if (err) {
                        res.send({
                            status: '-1000',
                            message: err.toString()
                        })
                        return;
                    }
                    else {
                        res.send({
                            status: '0000',
                            data: {
                                datasouce: result1,
                                count: count,
                                pages: Math.ceil(count / SqlInfo.params.pagesize),
                                pagenum: SqlInfo.params.pagenum,
                                pagesize: SqlInfo.params.pagesize
                            },
                            message: code['0000']
                        })
                    }
                });

            }
            else {
                res.send({
                    status: '0000',
                    data: {
                        datasouce: [],
                        count: 0,
                        pages: 0,
                        pagenum: 1,
                        pagesize: SqlInfo.params.pagesize
                    },
                    message: code['0000']
                })
            }
        }
    });
}

/**
 * @method 切换用户类型
 * @author lukaijie
 * @datetime 16/8/16
 */
exports.trggerUser = function (req, res) {
    var sqlInfo = {
        method: 'trggerUser',
        memo: '切换用户类型',
        params: {
            c_userid: req.body.userid,
            c_type: req.body.type
        },
        desc: "切换用户类型"
    }
    utool.sqlExect('UPDATE t_user SET c_type = ? WHERE c_userid = ?',
        [sqlInfo.params.c_type, sqlInfo.params.c_userid], sqlInfo, function (err, result) {
            if (err) {
                logger.info('切换用户类型：' + JSON.stringify(err));
                res.send({
                    status: '-1000',
                    message: code['-1000']
                })
            }
            else {
                res.send({
                    status: '0000',
                    message: code['0000']
                })
            }
        });
}

/**
 * @method 禁止可用
 * @author lukaijie
 * @datetime 16/8/16
 */
exports.isUse = function (req, res) {
    var sqlInfo = {
        method: 'isUse',
        memo: '禁止可用',
        params: {
            c_userid: req.body.userid,
            c_is_use: req.body.isuse
        },
        desc: "禁止可用"
    }
    utool.sqlExect('UPDATE t_user SET c_is_use = ? WHERE c_userid = ?',
        [sqlInfo.params.c_is_use, sqlInfo.params.c_userid], sqlInfo, function (err, result) {
            if (err) {
                logger.info('切换用户类型：' + JSON.stringify(err));
                res.send({
                    status: '-1000',
                    message: code['-1000']
                })
            }
            else {
                res.send({
                    status: '0000',
                    message: code['0000']
                })
            }
        });
}

/**
 * @method 服务审批页面
 * @author lukaijie
 * @datetime 16/8/16
 */
exports.approvalList = function (req, res) {
    res.render('system/approval', {
        session: req.session['user'],
        navs: [
            {
                name: '系统管理',
                url: ''
            },
            {
                name: '服务审批',
                url: '/approval'
            }
        ],
        menu: 'system',
        submenu: 'system_approval'
    });
}

/**
 * @method 查询所有服务
 * @author lukaijie
 * @datetime 16/8/15
 */
exports.getAllServiceList = function (req, res) {
    var SqlInfo = {
        method: 'getAllServiceList',
        memo: '查询所有服务',
        params: {
            pagenum: req.body.pagenum,            //页码
            pagesize: req.body.pagesize,          //页大小
            searchParams: req.body.searchParams
        },
        desc: ''
    }
    //根据shopexid查询对应的应用,分页查询
    var pagesize = SqlInfo.params.pagesize;
    var pageindex = (SqlInfo.params.pagenum - 1) * pagesize;

    var wherestr = '';


    var array = [];
    u.each(SqlInfo.params.searchParams.filters, function (m, n) {
        if (typeof m.filters == 'undefined') {
            switch (m.operator) {
                case 'like':
                    array.push(m.filed + " like '%" + m.value + "%'");
                    break;
                case 'eq':
                    array.push(m.filed + " = '" + m.value + "'");
                    break;
                case 'neq':
                    array.push(m.filed + " != " + m.value);
                    break;
            }
        }
        else {
            var sub_array = [];
            u.each(m.filters, function (a, b) {
                switch (a.operator) {
                    case 'eq':
                        sub_array.push(a.filed + " = " + a.value)
                        break;
                }
            })
            //sub_array.join(' ' + m.logic + ' ');
            if (sub_array.length > 1) {
                array.push('(' + sub_array.join(' ' + m.logic + ' ') + ')');
            }
            else if (sub_array.length == 1) {
                array.push(sub_array[0]);
            }
        }
    });
    if (array.length > 1) {
        wherestr = ' WHERE ' + array.join(' ' + SqlInfo.params.searchParams.logic + ' ');
    }
    else if (array.length == 1) {
        wherestr = ' WHERE ' + array.toString();
    }

    var sql1 = 'SELECT COUNT(*) AS counts FROM(SELECT t1.c_id,t2.c_customer,t1.c_userid,t2.c_username,c_servicename,c_apply_time,c_approval_time FROM t_user_service t1\
    LEFT JOIN t_user t2 on t1.c_userid = t2.c_userid\
    LEFT JOIN t_service t3 on t1.c_serviceid = t3.c_serviceid) AS db';

    console.log('SQL1:----' + sql1 + wherestr);
    utool.sqlExect(sql1 + wherestr, null, SqlInfo, function (err, result) {
        if (err) {
            res.send({
                status: '-1000',
                message: err.toString()
            })
            return;
        }
        else {
            console.log('counts:' + result[0].counts);
            var count = result[0].counts;
            if (result[0].counts > 0) {
                var sql2 = 'SELECT * FROM (SELECT t1.c_id,t2.c_customer,t1.c_userid,t2.c_username,c_servicename,c_apply_time,c_approval_time FROM t_user_service t1\
                LEFT JOIN t_user t2 on t1.c_userid = t2.c_userid\
                LEFT JOIN t_service t3 on t1.c_serviceid = t3.c_serviceid) AS db';

                console.log('SQL2:----' + sql2 + wherestr + ' ORDER BY c_apply_time DESC LIMIT ' + pageindex + ',' + pagesize);
                utool.sqlExect(sql2 + wherestr + ' ORDER BY c_apply_time DESC LIMIT ?,?', [pageindex, pagesize], SqlInfo, function (err, result1) {
                    if (err) {
                        res.send({
                            status: '-1000',
                            message: err.toString()
                        })
                        return;
                    }
                    else {
                        res.send({
                            status: '0000',
                            data: {
                                datasouce: result1,
                                count: count,
                                pages: Math.ceil(count / SqlInfo.params.pagesize),
                                pagenum: SqlInfo.params.pagenum,
                                pagesize: SqlInfo.params.pagesize
                            },
                            message: code['0000']
                        })
                    }
                });

            }
            else {
                res.send({
                    status: '0000',
                    data: {
                        datasouce: [],
                        count: 0,
                        pages: 0,
                        pagenum: 1,
                        pagesize: SqlInfo.params.pagesize
                    },
                    message: code['0000']
                })
            }
        }
    });
}