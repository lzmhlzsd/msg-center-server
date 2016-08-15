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
    fs = require('fs'),
    logger = require('../libs/logger');

/**
 * @method 模板页面
 * @author lukaijie
 * @datetime 16/5/12
 */
exports.index = function (req, res, next) {
    res.render('template/index', {
        session: req.session['user'],
        navs: [
            {
                name: '管理中心',
                url: ''
            },
            {
                name: '消息模板',
                url: '/template'
            }
        ],
        menu: 'admin',
        submenu: 'admin_template'
    });
}

/**
 * @method 根据用户ID 获取消息模板
 * @author lukaijie
 * @datetime 16/8/11
 */
exports.getTemplateByUser = function (req, res) {
    var SqlInfo = {
        method: 'getTemplateByUser',
        memo: '根据用户ID 获取消息模板',
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
        filed: 'c_temp_userid', operator: 'eq', value: req.session['user'].userid
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

    var sql1 = 'SELECT COUNT(*) AS counts FROM t_template';

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
                var sql2 = 'SELECT * FROM t_template';

                console.log('SQL2:----' + sql2 + wherestr + ' ORDER BY c_temp_create_time DESC LIMIT ' + pageindex + ',' + pagesize);
                utool.sqlExect(sql2 + wherestr + ' ORDER BY c_temp_create_time DESC LIMIT ?,?', [pageindex, pagesize], SqlInfo, function (err, result1) {
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
 * @method 创建新模板
 * @author lkj
 * @datetime 2016/8/7
 */
exports.create = function (req, res) {
    res.render('template/newtemplate', {
        session: req.session['user'],
        navs: [
            {
                name: '管理中心',
                url: ''
            },
            {
                name: '消息模板',
                url: '/template'
            },
            {
                name: '新建模板',
                url: '/template/new'
            }
        ],
        menu: 'admin',
        submenu: 'admin_template'
    });
}

/**
 * @method 编辑消息模板
 * @author lukaijie
 * @datetime 16/8/11
 */
exports.edit = function (req, res) {
    var sqlInfo = {
        method: 'edit',
        memo: '编辑消息模板',
        params: {
            c_temp_userid: req.session['user'].userid,
            c_temp_no: req.params.tempno
        },
        desc: '编辑消息模板'
    }
    utool.sqlExect('SELECT * FROM t_template WHERE c_temp_userid = ? AND c_temp_no = ?', [sqlInfo.params.c_temp_userid, sqlInfo.params.c_temp_no], sqlInfo, function (err, result) {
        if (err) {
            logger.info('编辑消息模板：' + JSON.stringify(err));
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
                        name: '消息模板',
                        url: '/template'
                    },
                    {
                        name: '编辑模板',
                        url: '/template/edit/' + req.params.tempno
                    }
                ],
                data: result[0],
                menu: 'admin',
                submenu: 'admin_template'
            });
        }
    })

}

/**
 * @method 校验模板编号唯一性(同一用户下不能相同)
 * @author lukaijie
 * @datetime 16/8/11
 */
exports.checktemplateno = function (req, res) {
    var sqlInfo = {
        method: 'savetemplate',
        memo: '校验模板编号唯一性(同一用户下不能相同)',
        params: {
            c_temp_userid: req.session['user'].userid,
            c_temp_no: req.body.template_no
        },
        desc: '校验模板编号唯一性(同一用户下不能相同)'
    }
    utool.sqlExect('SELECT COUNT(*) as counts FROM t_template WHERE c_temp_userid = ? AND c_temp_no = ?', [sqlInfo.params.c_temp_userid, sqlInfo.params.c_temp_no], sqlInfo, function (err, result) {
        if (err) {
            logger.info('校验模板编号唯一性(同一用户下不能相同)：' + JSON.stringify(err));
            res.send({
                status: '-1000',
                message: JSON.stringify(err)
            });
            return;
        }
        else {
            if (result[0].counts > 0) {
                res.send({
                    status: '1007',
                    message: code['1007']
                });
            }
            else {
                res.send({
                    status: '0000',
                    message: code['0000']
                });
            }
        }
    })
}

/**
 * @method 校验模板编号唯一性(同一用户下不能相同)
 * @author lukaijie
 * @datetime 16/8/11
 */
exports.checktemplateno2 = function (req, res) {
    var sqlInfo = {
        method: 'checktemplateno2',
        memo: '校验模板编号唯一性(同一用户下不能相同)',
        params: {
            c_temp_id: req.body.template_id,
            c_temp_userid: req.session['user'].userid,
            c_temp_no: req.body.template_no
        },
        desc: '校验模板编号唯一性(同一用户下不能相同)'
    }
    utool.sqlExect('SELECT * FROM t_template WHERE c_temp_userid = ? AND c_temp_no == ? AND c_temp_id != ?',
        [sqlInfo.params.c_temp_userid, sqlInfo.params.c_temp_no, sqlInfo.params.c_temp_id], sqlInfo, function (err, result) {
            if (err) {
                logger.info('校验模板编号唯一性(同一用户下不能相同)：' + JSON.stringify(err));
                res.send({
                    status: '-1000',
                    message: JSON.stringify(err)
                });
                return;
            }
            else {
                if (result[0].counts > 0) {
                    res.send({
                        status: '1007',
                        message: code['1007']
                    });
                }
                else {
                    res.send({
                        status: '0000',
                        message: code['0000']
                    });
                }
            }
        })
}

/**
 * @method savetemplate
 * @author lukaijie
 * @datetime 16/8/11
 */
exports.savetemplate = function (req, res) {
    var sqlInfo = {
        method: 'savetemplate',
        memo: '新建模板',
        params: {
            c_temp_userid: req.session['user'].userid,
            c_temp_no: req.body.template_no,
            c_temp_content: req.body.template_content,
            c_temp_desc: req.body.template_desc
        },
        desc: '新建模板'
    }
    utool.sqlExect('INSERT INTO t_template SET ?', [sqlInfo.params], sqlInfo, function (err, result) {
        if (err) {
            logger.info('新建模板：' + JSON.stringify(err));
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
 * @method updatetemplate
 * @author lukaijie
 * @datetime 16/8/11
 */
exports.updatetemplate = function (req, res) {
    var sqlInfo = {
        method: 'updatetemplate',
        memo: '更新模板',
        params: {
            c_temp_userid: req.session['user'].userid,
            c_temp_no: req.body.template_no,
            c_temp_content: req.body.template_content,
            c_temp_desc: req.body.template_desc
        },
        desc: '更新模板'
    }
    utool.sqlExect('UPDATE t_template SET c_temp_content = ? , c_temp_desc= ? WHERE c_temp_userid= ? AND c_temp_no= ?',
        [sqlInfo.params.c_temp_content, sqlInfo.params.c_temp_desc, sqlInfo.params.c_temp_userid, sqlInfo.params.c_temp_no], sqlInfo, function (err, result) {
            if (err) {
                logger.info('更新模板：' + JSON.stringify(err));
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