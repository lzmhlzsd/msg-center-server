/**
 * Created by lukaijie on 16/5/13.
 */
var pool = require('../libs/mysql'),
    request = require('request'),
    utool = require('../libs/utool'),
    md5 = require('MD5');
redis = require('../libs/redis');
logger = require('../libs/logger');

/**
 * @method 获取我的所有服务,分页查询
 * @author lukaijie
 * @datetime 16/5/19
 */
exports.getMyApp = function (req, res) {
    //查询数据
    var pagenum = typeof req.params.pagenum == 'undefined' ? 1 : req.params.pagenum;
    var fd_uid = req.session.fd_uid;

    var rdata = {
        apis: [],
        count: 0,
        pagenum: pagenum,    //页码
        pagesize: 10,        //页大小
        pages: 1             //页数
    }

    var ErrInfo = {
        method: 'getMyApp',
        memo: '根据fd_uid查询所有的服务数',
        params: {fd_uid: fd_uid}
    }
    //根据shopexid查询对应的应用,分页查询
    var pagesize = rdata.pagesize;
    var pageindex = (pagenum - 1) * pagesize;
    utool.sqlExect('SELECT COUNT(*) as counts FROM t_service WHERE fd_uid = ?', fd_uid, ErrInfo, function (err, result) {
        if (err) {
            utool.errView(res, err);
        }
        else {
            rdata.count = result[0].counts;
            rdata.pages = Math.ceil(rdata.count / rdata.pagesize);

            var ErrInfo = {
                method: 'getMyApp',
                memo: '分页查询数据',
                params: {fd_uid: fd_uid}
            }
            utool.sqlExect('SELECT * FROM t_service WHERE fd_uid = ? ORDER BY fd_create_time DESC LIMIT ?,?', [fd_uid, pageindex, pagesize], ErrInfo, function (err, result) {
                if (err) {
                    utool.errView(res, err);
                }
                else {
                    rdata.apis = result;
                    res.render('app/index', {rdata: rdata, uid: req.session['fd_uid']});
                }
            });
        }
    });
}

/**
 * @method 返回创建服务页面
 * @author lukaijie
 * @datetime 16/5/19
 */
exports.addMyApp = function (req, res) {
    res.render('app/addapp', {action: 'add', uid: req.session['fd_uid']});
}

/**
 * @method 返回更新服务内容页面
 * @author lukaijie
 * @datetime 16/5/20
 */
exports.updateMyAppPage = function (req, res) {
    //根据fd_serviceid查询服务内容
    var ErrInfo = {
        method: 'updateMyAppPage',
        memo: '根据fd_serviceid查询服务内容',
        params: {fd_serviceid: req.params.id}
    }
    utool.sqlExect('SELECT * FROM t_service WHERE fd_serviceid = ?', req.params.id, ErrInfo, function (err, result) {
        if (err) {
            utool.errView(res, err);
        }
        else {
            res.render('app/addapp', {list: result, action: 'edit', uid: req.session['fd_uid']});
        }
    });
}

/**
 * @method 更新服务内容
 * @author lukaijie
 * @datetime 16/5/20
 */
exports.updateMyApp = function (req, res) {
    var t_service = {
        fd_serviceid: req.body.fd_serviceid,
        fd_name: req.body.fd_name,
        fd_uid: req.session.fd_uid,
        fd_description: req.body.fd_description,
        fd_remark: req.body.fd_remark
    }
    var ErrInfo = {
        method: 'updateMyApp',
        memo: '根据fd_serviceid更新服务内容',
        params: {
            fd_name: t_service.fd_name,
            fd_description: t_service.fd_description,
            fd_remark: t_service.fd_remark,
            fd_serviceid: t_service.fd_serviceid,
            fd_uid: t_service.fd_uid
        }
    }
    utool.sqlExect('UPDATE t_service SET fd_name = ? , fd_description= ? , fd_remark= ? WHERE fd_serviceid= ? AND fd_uid= ?', [
        t_service.fd_name, t_service.fd_description, t_service.fd_remark, t_service.fd_serviceid, t_service.fd_uid
    ], ErrInfo, function (err, result) {
        if (err) {
            utool.errView(res, err);
        }
        else {
            redis.pub({
                "type": "service_update",
                "from": "website",
                "content": t_service.fd_serviceid
            });
            res.redirect('/my/app');
        }
    });
}

/**
 * @method 刷新服务
 * @author lukaijie
 * @datetime 16/6/2
 */
exports.refreshMyApp = function (req, res) {
    redis.pub({
        "type": "service_update",
        "from": "website",
        "content": req.body.fd_serviceid
    });
    return res.json({status: 0, message: '服务刷新成功!'})
}

/**
 * @method 保存新建的服务
 * @author lukaijie
 * @datetime 16/5/19
 */
exports.saveMyApp = function (req, res) {
    var param = {
        fd_serviceid: utool.randomString(7), //fd_serviceid 生成7位随机字符串
        fd_name: req.body.fd_name,
        fd_uid: req.session.fd_uid,
        fd_status: 1,    //服务状态 0-已禁用，1-未上线, 2-申请下线, 3-申请上线, 4-已上线 (默认为1)
        fd_description: req.body.fd_description,
        fd_config: '',
        fd_visible: 0,    //是否全平台可见（0-不可见 1-可见  默认为0）
        fd_remark: req.body.fd_remark
    }
    var ErrInfo = {
        method: 'saveMyApp',
        memo: '保存新建服务',
        params: param
    }
    utool.sqlExect('INSERT INTO t_service SET ? ', param, ErrInfo, function (err, result) {
        if (err) {
            utool.errView(res, err);
        }
        else {
            redis.pub({
                "type": "service_add",
                "from": "website",
                "content": param.fd_serviceid
            });
            res.redirect('/my/app');
        }
    });
}

/**
 * @method 删除服务;只能删除未上线的服务
 * @author lukaijie
 * @datetime 16/5/23
 */
exports.deleteMyApp = function (req, res) {
    var param = {
        fd_serviceid: req.body.fd_serviceid
    }
    var ErrInfo = {
        method: 'deleteMyApp',
        memo: '查询服务状态,已下线的服务才能删除',
        params: param
    }
    utool.sqlExect('SELECT * FROM t_service WHERE fd_serviceid = ?', param.fd_serviceid, ErrInfo, function (err, result) {
        if (err) {
            utool.errView(res, err);
        }
        else {
            if (result[0].fd_status == 1) { //已下线
                var ErrInfo = {
                    method: 'deleteMyApp',
                    memo: '删除服务',
                    params: param
                }
                utool.sqlExect('DELETE FROM t_service WHERE fd_serviceid = ? AND fd_status = 1', param.fd_serviceid, ErrInfo, function (err, result) {
                    if (err) {
                        utool.errView(res, err);
                    }
                    else {
                        res.json({status: 0, message: ''})
                    }
                });
            }
            else {
                redis.pub({
                    "type": "service_delete",
                    "from": "website",
                    "content": param.fd_serviceid
                });
                res.json({status: 101, message: '服务没有下线,不能删除!'})
            }
        }
    });
}

/**
 * @method 申请上线
 * @author lukaijie
 * @datetime 16/5/20
 */
exports.applyMyApp = function (req, res) {
    var t_service_apply = {
        fd_type: req.body.code == 2 ? 0 : 1,         	//--  申请类型类型（0申请下线，1申请上线，3、审核通过）
        fd_uid: req.session.fd_uid,      		//--  申请者的uid
        fd_serviceid: req.body.fd_serviceid				//--  服务的id
    }
    var ErrInfo = {
        method: 'applyMyApp',
        memo: '根据fd_uid查询是否存在申请列表',
        params: {fd_uid: t_service_apply.fd_uid}
    }
    utool.sqlExect('SELECT COUNT(*) as counts FROM t_service_apply WHERE fd_serviceid = ?', t_service_apply.fd_serviceid, ErrInfo, function (err, result) {
        if (err) {
            utool.errView(res, err);
        }
        else {
            if (result[0].counts == 0) {
                //插入新的申请
                var ErrInfo = {
                    method: 'applyMyApp',
                    memo: '插入新的上下线申请',
                    params: t_service_apply
                }
                utool.sqlExect('INSERT INTO t_service_apply SET ?', t_service_apply, ErrInfo, function (err, result) {
                    if (err) {
                        utool.errView(res, err);
                    }
                    else {
                        var ErrInfo = {
                            method: 'applyMyApp',
                            memo: 't_service申请上下线',
                            params: {fd_status: req.body.code, fd_serviceid: t_service_apply.fd_serviceid}
                        }
                        utool.sqlExect('UPDATE t_service SET fd_status = ? WHERE fd_serviceid= ?', [req.body.code, t_service_apply.fd_serviceid], ErrInfo, function (err, result) {
                            if (err) {
                                utool.errView(res, err);
                            }
                            else {
                                redis.pub({
                                    "type": "service_update",
                                    "from": "website",
                                    "content": t_service_apply.fd_serviceid
                                });
                                res.json({'status': 0})
                            }
                        })
                    }
                });
            }
            else {
                //update申请
                var ErrInfo = {
                    method: 'applyMyApp',
                    memo: 't_service申请上下线',
                    params: {fd_type: t_service_apply.fd_type, fd_serviceid: t_service_apply.fd_serviceid}
                }
                utool.sqlExect('UPDATE t_service_apply SET fd_type = ? WHERE fd_serviceid= ?', [t_service_apply.fd_type, t_service_apply.fd_serviceid], ErrInfo, function (err, result) {
                    if (err) {
                        utool.errView(res, err);
                    }
                    else {
                        var ErrInfo = {
                            method: 'applyMyApp',
                            memo: 't_service申请上下线',
                            params: {fd_status: req.body.code, fd_serviceid: t_service_apply.fd_serviceid}
                        }
                        utool.sqlExect('UPDATE t_service SET fd_status = ? WHERE fd_serviceid= ?', [req.body.code, t_service_apply.fd_serviceid], ErrInfo, function (err, result) {
                            if (err) {
                                utool.errView(res, err);
                            }
                            else {
                                redis.pub({
                                    "type": "service_update",
                                    "from": "website",
                                    "content": t_service_apply.fd_serviceid
                                });
                                res.json({'status': 0})
                            }
                        })
                    }
                })
            }
        }
    });
}

/**
 * @method 检查服务名称是否重复;检查规则,同一服务创建者下的服务名称唯一
 * @author lukaijie
 * @datetime 16/5/23
 */
exports.checkMyAppName = function (req, res) {
    var param = {
        fd_name: req.body.fd_name,
        fd_uid: req.session.fd_uid,
        fd_serviceid: req.body.fd_serviceid
    }
    var ErrInfo = {
        method: 'checkMyAppName',
        memo: '检查服务名称是否重复;检查规则,同一服务创建者下的服务名称唯一',
        params: param
    }
    utool.sqlExect('SELECT * FROM t_service WHERE fd_name= ? AND fd_uid= ?', [param.fd_name, param.fd_uid], ErrInfo, function (err, result) {
        if (err) {
            utool.errView(res, err);
        }
        else {
            if (result.length == 0 || (result.length == 1 && result[0].fd_serviceid == param.fd_serviceid)) {
                res.json({status: 0, message: ''});
            }
            else {
                res.json({status: 100, message: '服务名称已经存在!'});
            }
        }
    })
}

/**
 * @method
 * @author lukaijie
 * @datetime 16/5/23
 */
exports.getMyAppSetup = function (req, res) {
    //根据fd_serviceid查询服务内容
    var ErrInfo = {
        method: 'getMyAppSetup',
        memo: '根据fd_serviceid查询服务内容',
        params: {fd_serviceid: req.params.serviceid}
    }
    utool.sqlExect('SELECT * FROM t_service WHERE fd_serviceid = ?', req.params.serviceid, ErrInfo, function (err, result) {
        if (err) {
            utool.errView(res, err);
        }
        else {
            res.render('app/setup', {list: result, uid: req.session['fd_uid']});
        }
    });
}

/**
 * @method 设置是否全平台可见
 * @author lukaijie
 * @datetime 16/5/23
 */
exports.applyMyAppVisible = function (req, res) {
    var ErrInfo = {
        method: 'getMyAppSetup',
        memo: '根据fd_serviceid查询服务内容',
        params: {fd_serviceid: req.body.fd_serviceid}
    }
    utool.sqlExect('update t_service set fd_visible=(1 - fd_visible) WHERE fd_serviceid = ? ', req.body.fd_serviceid, ErrInfo, function (err, result) {
        if (err) {
            res.json({status: -1, message: err});
        }
        else {
            res.json({status: 0, message: ''});
        }
    });
}

/**
 * @method 添加服务的API
 * @author lukaijie
 * @datetime 16/5/23
 */
exports.addMyAppAPI = function (req, res) {
    res.render('app/addapi', {fd_serviceid: req.params.serviceid, uid: req.session['fd_uid']});
}

/**
 * @method getMyAppAPI
 * @author lukaijie
 * @datetime 16/5/26
 */
exports.getMyAppAPI = function (req, res) {
    var ErrInfo = {
        method: 'addMyAppAPI',
        memo: '根据fd_serviceid查询对应的API',
        params: {
            fd_serviceid: req.body.fd_serviceid
        }
    }
    utool.sqlExect('SELECT * FROM t_service WHERE fd_serviceid = ? ', req.body.fd_serviceid, ErrInfo, function (err, result) {
        if (err) {
            utool.errView(res, err);
        }
        else {
            res.json({status: 0, data: result});
        }
    });
}

/**
 * @method 保存服务的API;修改t_service 表中的fd_config 字段的内容
 * @author lukaijie
 * @datetime 16/5/25
 */
exports.saveMyAppAPI = function (req, res) {
    var ErrInfo = {
        method: 'saveMyAppAPI',
        memo: '保存服务的API;修改t_service 表中的fd_config 字段的内容',
        params: {
            fd_serviceid: req.body.fd_serviceid,
            fd_config: req.body.fd_config
        }
    }
    utool.sqlExect('UPDATE t_service SET fd_config= ? WHERE fd_serviceid = ? ', [req.body.fd_config, req.body.fd_serviceid], ErrInfo, function (err, result) {
        if (err) {
            res.json({status: -1, message: err});
        }
        else {
            redis.pub({
                "type": "api_update",
                "from": "website",
                "content": req.body.fd_serviceid
            });
            res.json({status: 0, message: '保存成功!'});
        }
    });
}


function gettimestamp() {
    var datetime = new Date();
    return datetime.getFullYear() + formate(datetime.getMonth() + 1) + formate(datetime.getDate()) +
        formate(datetime.getHours()) + formate(datetime.getMinutes()) + formate(datetime.getSeconds());
}
function formate(num) {
    if (num < 10) {
        return '0' + num;
    }
    else {
        return num;
    }
}
exports.requesting = function (req, res) {
    var url1 = 'https://api.miaodiyun.com/20150822/query/accountInfo?'
    var sid = 'd63daeae6dc44cfca5431c62f0085e3c';
    var token = 'f9e3016c5bfa405aa96fe1de902ab133';
    var timestamp = gettimestamp();
    console.log('timestamp:' + timestamp);

    var sig = md5(sid + token + timestamp);
    console.log('md5:' + sig);

    var url2 = url1 + 'accountSid=' + sid + '&timestamp=' + timestamp + '&sig=' + sig + '&respDataType=JSON';
    console.log('url2:' + url2);

    request.post(url2, function (error, response, result) {
        console.log('result:' + result);
    });
}

exports.send = function (req, res) {
    var url1 = 'https://api.miaodiyun.com/20150822/affMarkSMS/sendSMS?'
    var sid = 'd63daeae6dc44cfca5431c62f0085e3c';
    var smsContent = '机床报警，请维修';
    var to = '13917609856';
    var token = 'f9e3016c5bfa405aa96fe1de902ab133';
    var timestamp = gettimestamp();
    console.log('timestamp:' + timestamp);

    var sig = md5(sid + token + timestamp);
    console.log('md5:' + sig);

    var url2 = url1 + 'accountSid=' + sid + '&smsContent=' + smsContent +
        '&to=' + to + '&timestamp=' + timestamp + '&sig=' + sig + '&respDataType=JSON';
    console.log('url2:' + url2);

    request.post(url2, function (error, response, result) {
        console.log('result:' + result);
    });
}