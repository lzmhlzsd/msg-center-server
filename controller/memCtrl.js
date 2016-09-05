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
        session: req.session['user'],
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
        weixinserver: u.where(req.session['user'].serviceList, {c_serviceid: 3}).length > 0 ? true : false,
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
    console.log(req.session['user'].qyh_agentid);
    var api = new API(req.session['user'].qyh_cropid, req.session['user'].qyh_screct, req.session['user'].qyh_agentid, function (callback) {
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
        session: req.session['user'],
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
            c_userno: req.params.memno
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
            res.render('member/edit', {
                session: req.session['user'],
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
                        url: '/member/edit/' + req.params.c_userno
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
 * @method 检查人员编号是否已经存在
 * @author lukaijie
 * @datetime 16/8/15
 */
exports.checkno = function (req, res) {
    var sqlInfo = {
        method: 'checkno',
        memo: '检查人员编号是否已经存在',
        params: {
            c_userid: req.session['user'].userid,
            c_userno: req.body.userno
        },
        desc: '检查人员编号是否已经存在'
    }
    utool.sqlExect('SELECT COUNT(*) as counts FROM t_member WHERE c_userid = ? AND c_userno = ?', [sqlInfo.params.c_userid, sqlInfo.params.c_userno], sqlInfo, function (err, result) {
        if (err) {
            logger.info('检查人员编号是否已经存在：' + JSON.stringify(err));
            res.send({
                status: '-1000',
                message: JSON.stringify(err)
            });
            return;
        }
        else {
            if (result[0].counts == 0) {
                res.send({
                    status: '0000',
                    message: code['0000']
                });
            }
            else {
                res.send({
                    status: '1008',
                    message: code['1008']
                });
            }
        }
    })
}

/**
 * @method 检查人员编号是否已经存在
 * @author lukaijie
 * @datetime 16/8/15
 */
exports.checkno2 = function (req, res) {
    var sqlInfo = {
        method: 'checkno',
        memo: '检查人员编号是否已经存在',
        params: {
            c_id: req.body.userid,
            c_userid: req.session['user'].userid,
            c_userno: req.body.userno
        },
        desc: '检查人员编号是否已经存在'
    }
    utool.sqlExect('SELECT COUNT(*) as counts FROM t_member WHERE c_userid = ? AND c_userno = ? AND c_id != ?',
        [sqlInfo.params.c_userid, sqlInfo.params.c_userno, sqlInfo.params.c_id], sqlInfo, function (err, result) {
            if (err) {
                logger.info('检查人员编号是否已经存在：' + JSON.stringify(err));
                res.send({
                    status: '-1000',
                    message: JSON.stringify(err)
                });
                return;
            }
            else {
                if (result[0].counts == 0) {
                    res.send({
                        status: '0000',
                        message: code['0000']
                    });
                }
                else {
                    res.send({
                        status: '1008',
                        message: code['1008']
                    });
                }
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
 * @method 更新人员
 * @author lukaijie
 * @datetime 16/8/15
 */
exports.updatemember = function (req, res) {
    var sqlInfo = {
        method: 'updatemember',
        memo: '更新人员',
        params: {
            c_userid: req.session['user'].userid,
            c_userno: req.body.userno,
            c_name: req.body.name,
            c_mobile: req.body.mobile,
            c_email: req.body.email
        },
        desc: '更新人员'
    }
    utool.sqlExect('UPDATE t_member SET c_name = ? , c_mobile = ?, c_email = ? WHERE c_userid= ? AND c_userno= ?',
        [sqlInfo.params.c_name, sqlInfo.params.c_mobile, sqlInfo.params.c_email, sqlInfo.params.c_userid, sqlInfo.params.c_userno], sqlInfo, function (err, result) {
            if (err) {
                logger.info('更新人员：' + JSON.stringify(err));
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
                case 'eq':
                    array.push(m.filed + " = '" + m.value + "'");
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
 * @method 获取微信通讯录
 * @author lukaijie
 * @datetime 16/8/18
 */
exports.getweixinUsers = function (req, res) {
    console.log(req.session['user'].qyh_cropid);
    console.log(req.session['user'].qyh_screct);
    console.log(req.session['user'].qyh_agentid);
    //var api = new API(req.session['user'].qyh_cropid, req.session['user'].qyh_screct, req.session['user'].qyh_agentid, function (callback) {
    //    memcached.get(req.session['user'].qyh_cropid, function (err, data) {
    //        if (err) {
    //            logger.info(err);
    //        }
    //        console.log('memcached:' + JSON.stringify(data));
    //        callback(null, data);
    //    });
    //}, function (token, callback) {
    //    memcached.set(req.session['user'].qyh_cropid, token, 7200, function (err) {
    //        if (err) {
    //            logger.info(err);
    //        }
    //    });
    //});
    var api = new API(req.session['user'].qyh_cropid, req.session['user'].qyh_screct, req.session['user'].qyh_agentid);

    //* @param {Number} departmentId 部门ID
    //* @param {Number} fetchChild 值：1/0，是否递归获取子部门下面的成员
    //* @param {Number} status 0获取全部员工，1获取已关注成员列表，2获取禁用成员列表，4获取未关注成员列表。status可叠加
    //* @param {Function} callback 回调函数

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
            var userno = '';
            u.each(result.userlist, function (value, key) {
                userno = userno + '"' + value.userid + '"';
                if (key < result.userlist.length - 1) {
                    userno = userno + ',';
                }
            })
            //删除表中已经存在的编号人员
            var sqlInfo = {
                method: 'getweixinUsers',
                memo: '删除表中已经存在的编号人员',
                params: {
                    userno: userno.toString()
                },
                desc: '删除表中已经存在的编号人员'
            }
            console.log('DELETE FROM t_member WHERE c_userno IN (' + sqlInfo.params.userno + ')')
            utool.sqlExect('DELETE FROM t_member WHERE c_userno IN (' + sqlInfo.params.userno + ')', null, sqlInfo, function (err, result1) {
                if (err) {
                    logger.info('删除表中已经存在的编号人员：' + JSON.stringify(err));
                    res.send({
                        status: '-1000',
                        message: JSON.stringify(err)
                    });
                    return;
                }
                else {
                    console.log('删除成功')
                    //插入新的数据
                    var insertdata = '';

                    u.each(result.userlist, function (value, key) {
                        insertdata = insertdata + '("' + (typeof value.avatar != 'undefined' ? value.avatar : '') + '","' +
                            (typeof value.name != 'undefined' ? value.name : '') + '","' +
                            (typeof value.userid != 'undefined' ? value.userid : '') + '","' +
                            (typeof value.mobile != 'undefined' ? value.mobile : '') + '","' +
                            (typeof value.email != 'undefined' ? value.email : '') + '","' +
                            (typeof value.weixinid != 'undefined' ? value.weixinid : '') + '",' +
                            req.session['user'].userid + ',' +
                            1 + ',' +
                            (typeof value.status != 'undefined' ? value.status : '') +
                            ')';
                        if (key < result.userlist.length - 1) {
                            insertdata = insertdata + ',';
                        }
                    })


                    var sqlInfo = {
                        method: 'getweixinUsers',
                        memo: '插入新的数据',
                        params: {
                            insertdata: insertdata
                        },
                        desc: '插入新的数据'
                    }
                    console.log('INSERT INTO t_member (c_avatar, c_name, c_userno, c_mobile, c_email, c_weixinid, c_userid, c_sync,c_status) VALUES ' + sqlInfo.params.insertdata);
                    utool.sqlExect('INSERT INTO t_member (c_avatar, c_name, c_userno, c_mobile, c_email, c_weixinid, c_userid, c_sync,c_status) VALUES ' +
                        sqlInfo.params.insertdata, null, sqlInfo, function (err, result) {
                        if (err) {
                            logger.info('插入新的数据：' + JSON.stringify(err));
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
                            })
                        }

                    });
                }
            });

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
                session: req.session['user'],
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
 * @method 删除人员
 * @author lukaijie
 * @datetime 16/9/5
 */
exports.deleteMember = function(req, res){
    var sqlInfo = {
        method: 'deleteMember',
        memo: '删除人员',
        params: {
            c_id: req.body.mem_id
        },
        desc: '删除人员'
    }
    utool.sqlExect('DELETE FROM t_member WHERE c_id= ?',
        [sqlInfo.params.c_id], sqlInfo, function (err, result) {
            if (err) {
                logger.info('删除人员：' + JSON.stringify(err));
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
