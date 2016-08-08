var indexCtrl = require('../controller/indexCtrl'),
    appCtrl = require('../controller/appCtrl'),
    tempCtrl = require('../controller/templateCtrl'),
    serviceCtrl = require('../controller/serviceCtrl'),
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
    /** end;serverList **/

    /** start:应用 **/
    app.get('/app/new', practice.checkSession, indexCtrl.newapp);
    app.post('/app/checkname', indexCtrl.checkName);
    app.post('/app/save', indexCtrl.createApp);
    app.post('/getAppList', practice.checkSession, indexCtrl.getAppList);

    app.get('/app/edit/:id', practice.checkSession, indexCtrl.editapp);
    app.post('/app/update', indexCtrl.updateApp);

    app.get('/app/view/:id', practice.checkSession, indexCtrl.viewapp);
    app.post('/app/apply', indexCtrl.apply);

    /** end:应用 **/

    /** start:消息模板 **/
    app.get('/template', tempCtrl.index);
    app.get('/template/new', tempCtrl.create);
    /** end:消息模板 **/

    /** start:api **/

    /** end:api **/
    app.locals.brushRespones = function (data, definitions) {

    }
}

