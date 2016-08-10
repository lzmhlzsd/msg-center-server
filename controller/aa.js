/**
 * Created by lukaijie on 16/8/10.
 */
/**
 * Created by lukaijie on 16/8/1.
 */
var pool = require('../libs/mysql'),
    request = require('request'),
    utool = require('../libs/utool'),
    config = require('../libs/config'),
    errorcode = require('../libs/errors').code,
    logger = require('../libs/logger'),
    redis = require('../libs/redis'),
    u = require('underscore'),
    md5 = require('MD5');

/**
 * @method 应用审批
 * @author lukaijie
 * @datetime 16/5/12
 */
exports.approvalPage = function (req, res, next) {
    res.render('home/app_approval', {
        shopexid: (typeof req.session['user'].fd_shopexid == 'undefined') ? "" : req.session['user'].fd_shopexid,
        navs: [
            {
                name: '管理中心',
                url: ''
            },
            {
                name: '应用审批',
                url: '/service'
            }
        ],
        menu: 'admin',
        submenu: 'admin_app'
    });
}

/**
 * @method 查询所有申请审核的应用
 * @author lukaijie
 * @datetime 16/8/1
 */
exports.getAppApplyList = function (req, res) {
    var SqlInfo = {
        method: 'getUserList',
        memo: '查询所有用户',
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

    var sql1 = 'select count(*) as counts from(select \
    t1.fd_id as id,\
    t2.fd_id as app_id,\
    t2.fd_name as app_name,\
    t1.fd_type as app_type,\
    t4.fd_serviceid as service_id,\
    t4.fd_name as service_name,\
    t1.fd_operator as operator_id,\
    t1.fd_apply_time as apply_time,\
    t1.fd_approval_time as approval_time\
    from t_app_apply t1\
    left join t_app t2 on t1.fd_app_id=t2.fd_id\
    left join t_user t3 on t3.fd_uid=t2.fd_uid\
    left join t_service t4 on t1.fd_serviceid=t4.fd_serviceid) as tb';

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
                var sql2 = 'select * from (select\
                t1.fd_id as id,\
                t2.fd_id as app_id,\
                t2.fd_name as app_name,\
                t1.fd_type as app_type,\
                t4.fd_serviceid as service_id,\
                t4.fd_name as service_name,\
                t1.fd_operator as operator_id,\
                t1.fd_apply_time as apply_time,\
                t1.fd_approval_time as approval_time\
                from t_app_apply t1\
                left join t_app t2 on t1.fd_app_id=t2.fd_id\
                left join t_user t3 on t3.fd_uid=t2.fd_uid\
                left join t_service t4 on t1.fd_serviceid=t4.fd_serviceid) as tb';

                console.log('SQL2:----' + sql2 + wherestr + ' ORDER BY apply_time DESC LIMIT ' + pageindex + ',' + pagesize);
                utool.sqlExect(sql2 + wherestr + ' ORDER BY apply_time DESC LIMIT ?,?', [pageindex, pagesize], SqlInfo, function (err, result1) {
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
                            message: errorcode['0000']
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
                    message: errorcode['0000']
                })
            }
        }
    });
}

/**
 * @method 审核
 * @author lukaijie
 * @datetime 16/8/1
 */
exports.approval = function (req, res) {
    var SqlInfo = {
        method: 'approval',
        memo: '审核应用',
        params: {
            id: req.body.id,
            app_id: req.body.app_id,
            serviceid: req.body.serviceid,
            fd_shopexid: req.session['user'].fd_shopexid
        },
        desc: '审核应用'
    }
    var date = new Date();
    utool.sqlExect('UPDATE t_app_apply SET fd_type = ?, fd_operator = ?, fd_approval_time = ? WHERE fd_id = ?', [2, SqlInfo.params.fd_shopexid, date, SqlInfo.params.id], SqlInfo, function (err, result) {
        if (err) {
            res.send({
                status: '-1000',
                message: err.toString()
            })
            return;
        }
        else {
            console.log(SqlInfo)
            utool.sqlExect('UPDATE t_app_service SET fd_status = ? WHERE fd_app_id = ? AND fd_serviceid = ?', [2, SqlInfo.params.app_id, SqlInfo.params.serviceid], SqlInfo, function (err, result1) {
                if (err) {
                    res.send({
                        status: '-1000',
                        message: err.toString()
                    })
                    return;
                }
                else {
                    //redis消息通知

                    redis.pub({
                        "type": "app_apply",
                        "from": "website",
                        "content": SqlInfo.params.app_id
                    });

                    res.send({
                        status: '0000',
                        data: {
                            fd_type: 2,
                            fd_operator: SqlInfo.params.fd_shopexid,
                            fd_approval_time: date
                        },
                        message: errorcode['0000']
                    })
                }
            });
        }
    });
}
