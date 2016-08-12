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
    logger = require('../libs/logger');

var API = require('wechat-enterprise').API;


/**
 * @method 人员页面
 * @author lukaijie
 * @datetime 16/5/12
 */
exports.index = function (req, res, next) {
    res.render('member/index', {
        user_name: req.session['user'].username,
        navs: [
            {
                name: '管理中心',
                url: ''
            },
            {
                name: '通讯管理',
                url: '/member'
            }
        ],
        menu: 'admin',
        submenu: 'admin_member'
    });
}

/**
 * @method 获取所有人员
 * @author lukaijie
 * @datetime 16/8/12
 */
exports.getDepartmentUsers = function (req, res) {
    console.log(req.session['user'].qyh_cropid);
    console.log(req.session['user'].qyh_screct);
    var api = new API(req.session['user'].qyh_cropid, req.session['user'].qyh_screct, 1, function (callback) {
        memcached.get(req.session['user'].qyh_cropid, function (err, data) {
            if (err) {
                logger.info(err);
            }
            callback(null, data);
        });
    }, function (token, callback) {
        memcached.set(req.session['user'].qyh_cropid, token, 300, function (err) {
            if (err) {
                logger.info(err);
            }
        });
    });
    api.getDepartmentUsersDetail(1, 1, 0, function (err, result) {
        if (err) {
            logger.info('获取微信企业号所有人员：' + JSON.stringify(err));
            res.send({
                status: '-1000',
                message: JSON.stringify(err)
            });
            return;
        }
        else {
            res.send({
                status: '0000',
                data: result,
                message: code['0000']
            })
        }
    });
}

/**
 * @method 新建人员
 * @author lukaijie
 * @datetime 16/8/12
 */
exports.create = function (req, res) {
    res.render('member/new', {
        user_name: req.session['user'].username,
        navs: [
            {
                name: '管理中心',
                url: ''
            },
            {
                name: '通讯管理',
                url: '/template'
            },
            {
                name: '新建人员',
                url: '/member/new'
            }
        ],
        menu: 'admin',
        submenu: 'admin_member'
    });
}

/**
 * @method 更新人员
 * @author lukaijie
 * @datetime 16/8/12
 */
exports.edit = function (req, res) {
    var sqlInfo = {
        method: 'edit',
        memo: '更新人员',
        params: {
            c_userid: req.session['user'].userid,
            c_userno: req.params.userno
        },
        desc: '更新人员'
    }
    utool.sqlExect('SELECT * FROM t_template WHERE c_temp_userid = ? AND c_temp_no = ?', [sqlInfo.params.c_temp_userid, sqlInfo.params.c_temp_no], sqlInfo, function (err, result) {
        if (err) {
            logger.info('更新人员：' + JSON.stringify(err));
            utool.errView(res, err);
            return;
        }
        else {
            if (result.length == 0) {
                utool.errView(res, 'not found', 404);
                return;
            }
            res.render('template/edittemplate', {
                user_name: req.session['user'].username,
                navs: [
                    {
                        name: '管理中心',
                        url: ''
                    },
                    {
                        name: '通讯管理',
                        url: '/template'
                    },
                    {
                        name: '编辑人员',
                        url: '/template/edit/' + req.params.c_userno
                    }
                ],
                data: result[0],
                menu: 'admin',
                submenu: 'admin_member'
            });
        }
    })
}

/**
 * @method 新建人员
 * @author lukaijie
 * @datetime 16/8/12
 */
exports.savemember = function (req, res) {
    var sqlInfo = {
        method: 'savemember',
        memo: '新建人员',
        params: {
            c_userid: req.session['user'].userid,
            c_userno: req.body.userno,
            c_name: req.body.name,
            c_mobile: req.body.mobile,
            c_email: req.body.email
        },
        desc: '新建人员'
    }
    utool.sqlExect('INSERT INTO t_member SET ?', [sqlInfo.params], sqlInfo, function (err, result) {
        if (err) {
            logger.info('新建人员：' + JSON.stringify(err));
            res.send({
                status: '-1000',
                message: JSON.stringify(err)
            });
            return;
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
 * @method 根据用户查询人员
 * @author lukaijie
 * @datetime 16/8/12
 */
exports.getMemberByUser = function (req, res) {
    var SqlInfo = {
        method: 'getMemberByUser',
        memo: '根据用户查询人员',
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
        filed: 'c_userid', operator: 'eq', value: req.session['user'].userid
    })

    var array = [];
    u.each(SqlInfo.params.searchParams.filters, function (m, n) {
        if (typeof m.filters == 'undefined') {
            switch (m.operator) {
                case 'like':
                    array.push(m.filed + " like '%" + m.value + "%'");
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

    var sql1 = 'SELECT COUNT(*) AS counts FROM t_member';

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
                var sql2 = 'SELECT * FROM t_member';

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
 * @method sync同步到微信
 * @author lukaijie
 * @datetime 16/8/12
 */
exports.sync = function (req, res) {
    //查询人员
    var sqlInfo = {
        method: 'sync',
        memo: '根据用户编号查询需要同步的用户',
        params: {
            c_userid: req.session['user'].userid,
            c_userno: req.params.userno
        },
        desc: '更新人员'
    }
    utool.sqlExect('SELECT * FROM t_member WHERE c_userid = ? AND c_userno = ?', [sqlInfo.params.c_userid, sqlInfo.params.c_userno], sqlInfo, function (err, result) {
        if (err) {
            logger.info('更新人员：' + JSON.stringify(err));
            utool.errView(res, err);
            return;
        }
        else {
            if (result.length == 0) {
                utool.errView(res, 'not found', 404);
                return;
            }
            res.render('template/edittemplate', {
                user_name: req.session['user'].username,
                navs: [
                    {
                        name: '管理中心',
                        url: ''
                    },
                    {
                        name: '通讯管理',
                        url: '/template'
                    },
                    {
                        name: '编辑人员',
                        url: '/template/edit/' + req.params.c_userno
                    }
                ],
                data: result[0],
                menu: 'admin',
                submenu: 'admin_member'
            });
        }
    })
}
