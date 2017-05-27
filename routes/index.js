var indexCtrl = require('../controller/indexCtrl'),
    appCtrl = require('../controller/appCtrl'),
    tempCtrl = require('../controller/templateCtrl'),
    serviceCtrl = require('../controller/serviceCtrl'),
    setupCtrl = require('../controller/setupCtrl'),
    memCtrl = require('../controller/memCtrl'),
    systemCtrl = require('../controller/systemCtrl'),
    noticeCtrl = require('../controller/noticeCtrl'),
    bigScreenCtrl = require('../controller/bigScreenCtrl'),
    config = require('../libs/config'),
    practice = require('../libs/practice'),
    u = require("underscore");

module.exports = function (app) {
    /** start:Oauth **/
    app.get('/', function (req, res) {
        if (typeof req.session.user != 'undefined') {
            res.redirect('/index');
        }
        else {
            res.render('login');
        }
    });
    app.post('/login', indexCtrl.login);

    app.get('/signup', indexCtrl.signup);
    app.post('/checkUserName', indexCtrl.checkUserName);
    app.post('/register', indexCtrl.register);

    app.get('/logout', indexCtrl.logout);

    app.get('/index', practice.checkSession, indexCtrl.index);
    /** end:Oauth **/

    /** start:serverList **/
    app.get('/serverList', practice.checkSession, serviceCtrl.index);
    app.get('/getServiceList', practice.checkSession, serviceCtrl.getServiceList);
    app.post('/applyservice', practice.checkSession, serviceCtrl.applyservice);
    app.get('/approval', serviceCtrl.approval);
    app.post('/approvalpc', practice.checkSession, serviceCtrl.approvalpc);
    app.post('/updateapprovalpc', practice.checkSession, serviceCtrl.updateapprovalpc);
    /** end;serverList **/

    /** start:控制台 **/
    app.get('/getTodayData', practice.checkSession, indexCtrl.getTodayData);
    app.post('/getHistoryData', practice.checkSession, indexCtrl.getHistoryData);
    /** end:应用 **/

    /** start:消息模板 **/
    app.get('/template', practice.checkSession, tempCtrl.index);
    app.post('/getTemplateByUser', practice.checkSession, tempCtrl.getTemplateByUser);
    app.get('/template/new', practice.checkSession, tempCtrl.create);
    app.get('/template/edit/:tempno', practice.checkSession, tempCtrl.edit);
    app.post('/template/save', practice.checkSession, tempCtrl.savetemplate);
    app.post('/template/update', practice.checkSession, tempCtrl.updatetemplate);
    app.post('/template/checkno', practice.checkSession, tempCtrl.checktemplateno);
    app.post('/template/checkno2', practice.checkSession, tempCtrl.checktemplateno2);
    app.post('/getTemplateFromYPW', practice.checkSession, tempCtrl.getTemplateFromYPW);
    /** end:消息模板 **/

    /** start:人员管理 **/
    app.get('/member', practice.checkSession, memCtrl.index);
    app.post('/getMemberByUser', practice.checkSession, memCtrl.getMemberByUser);
    app.get('/getDepartmentUsers', practice.checkSession, memCtrl.getDepartmentUsers);
    app.get('/member/new', practice.checkSession, memCtrl.create);
    app.get('/member/edit/:memno', practice.checkSession, memCtrl.edit);
    app.post('/member/save', practice.checkSession, memCtrl.savemember);
    app.post('/member/update', practice.checkSession, memCtrl.updatemember);
    app.post('/member/sync', practice.checkSession, memCtrl.sync);
    app.post('/member/checkno', practice.checkSession, memCtrl.checkno);
    app.post('/member/checkno2', practice.checkSession, memCtrl.checkno2);
    app.post('/deleteMember', practice.checkSession, memCtrl.deleteMember);

    //微信
    app.get('/getweixinUsers', practice.checkSession, memCtrl.getweixinUsers);
    /** end:人员管理 **/

    /** start:设置中心 **/
    app.get('/setup', practice.checkSession, setupCtrl.index);
    app.post('/saveConfig', practice.checkSession, setupCtrl.saveConfig);
    app.get('/getConfig', practice.checkSession, setupCtrl.getConfig);
    /** end:设置中心 **/

    /** start:消息日志 **/
    app.get('/noticelog', practice.checkSession, noticeCtrl.index);
    app.post('/getLog', practice.checkSession, noticeCtrl.getLog);
    /** end:消息日志 **/

    /** start:大屏看板 */
    app.get('/bigScreen', practice.checkSession, bigScreenCtrl.index);
    app.get('/bigScreen/new', practice.checkSession, bigScreenCtrl.new);
    app.post('/bigScreen/getdata', practice.checkSession, bigScreenCtrl.getdata);
    app.get('/bigScreen/save', practice.checkSession, bigScreenCtrl.save);
    /** end:大屏看板 */

    /** start:系统管理 **/
    app.get('/account', practice.checkSession, practice.checkRole, systemCtrl.account);
    app.post('/getAllAccount', practice.checkSession, practice.checkRole, systemCtrl.getAllAccount);
    app.post('/trggerUser', practice.checkSession, practice.checkRole, systemCtrl.trggerUser);
    app.post('/isUse', practice.checkSession, practice.checkRole, systemCtrl.isUse);

    app.get('/approvalList', practice.checkSession, practice.checkRole, systemCtrl.approvalList);
    app.post('/getAllServiceList', practice.checkSession, practice.checkRole, systemCtrl.getAllServiceList);
    /** end:系统管理 **/

    app.locals.brushRespones = function (data, definitions) {

    }
}

