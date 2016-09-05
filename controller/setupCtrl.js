/**
 * Created by lkj on 2016/8/9.
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
    res.render('setup/index', {
        session: req.session['user'],
        navs: [
            {
                name: '管理中心',
                url: ''
            },
            {
                name: '设置中心',
                url: '/setup'
            }
        ],
        menu: 'admin',
        submenu: 'admin_setup'
    });
}

/**
 * @method getConfig
 * @author lukaijie
 * @datetime 16/8/11
 */
exports.getConfig = function (req, res) {
    var sqlInfo = {
        method: 'getConfig',
        memo: '查询配置信息',
        params: {
            c_userid: req.session['user'].userid
        },
        desc: '查询配置信息'
    }
    utool.sqlExect('SELECT * FROM t_config WHERE c_userid = ?', [sqlInfo.params.c_userid], sqlInfo, function (err, result) {
        if (err) {
            logger.info('查询配置信息：' + JSON.stringify(err));
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
            });
        }
    })
}

/**
 * @method saveConfig
 * @author lukaijie
 * @datetime 16/8/11
 */
exports.saveConfig = function (req, res) {
    var sqlInfo = {
        method: 'saveConfig',
        memo: '保存配置',
        params: {
            c_userid: req.session['user'].userid,
            c_email_host: req.body.host,
            c_email_port: req.body.port,
            c_email_username: req.body.username,
            c_email_password: req.body.password,
            c_msg_apikey: req.body.apikey,
            c_weixin_qyh_cropid: req.body.wxqy_corpid,
            c_weixin_qyh_screct: req.body.wxqy_secret,
            c_weixin_qyh_agentid: req.body.c_weixin_qyh_agentid
        },
        desc: '保存配置'
    }
    utool.sqlExect('SELECT COUNT(*) as counts FROM t_config WHERE c_userid = ?', [sqlInfo.params.c_userid], sqlInfo, function (err, result) {
        if (err) {
            logger.info('保存配置：' + JSON.stringify(err));
            res.send({
                status: '-1000',
                message: JSON.stringify(err)
            });
            return;
        }
        else {
            //存储新的cropid和screct
            req.session['user'].msg_apikey = sqlInfo.params.c_msg_apikey;
            req.session['user'].qyh_cropid = sqlInfo.params.c_weixin_qyh_cropid;
            req.session['user'].qyh_screct = sqlInfo.params.c_weixin_qyh_screct;
            req.session['user'].qyh_agentid = sqlInfo.params.c_weixin_qyh_agentid;

            if (result[0].counts == 0) {
                sqlInfo.desc = '插入数据';
                utool.sqlExect('INSERT INTO t_config SET ?', sqlInfo.params, sqlInfo, function (err, result) {
                    if (err) {
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
            else {
                sqlInfo.desc = '更新数据';
                utool.sqlExect('UPDATE t_config SET c_email_host = ?, c_email_port = ?, \
                    c_email_username = ?,c_email_password = ?,c_msg_apikey = ?,c_weixin_qyh_cropid = ?,c_weixin_qyh_screct = ?,c_weixin_qyh_agentid = ?\
                    WHERE c_userid = ?',
                    [sqlInfo.params.c_email_host, sqlInfo.params.c_email_port,
                        sqlInfo.params.c_email_username, sqlInfo.params.c_email_password,
                        sqlInfo.params.c_msg_apikey, sqlInfo.params.c_weixin_qyh_cropid, sqlInfo.params.c_weixin_qyh_screct, sqlInfo.params.c_weixin_qyh_agentid,
                        sqlInfo.params.c_userid], sqlInfo, function (err, result) {
                        if (err) {
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
        }
    })
}