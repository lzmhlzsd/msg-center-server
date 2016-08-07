var indexCtrl = require('../controller/indexCtrl'),
    appCtrl = require('../controller/appCtrl'),
    tempCtrl = require('../controller/templateCtrl'),
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

    app.get('/index', practice.checkSession, indexCtrl.index);
    /** end:Oauth **/

    /** start:应用 **/
    app.get('/app/new', practice.checkSession, indexCtrl.newapp);
    app.post('/app/checkname', indexCtrl.checkName);
    app.post('/app/save', indexCtrl.createApp);
    app.post('/getAppList', practice.checkSession, indexCtrl.getAppList);

    app.get('/app/edit/:id', practice.checkSession, indexCtrl.editapp);
    app.post('/app/update', indexCtrl.updateApp);

    app.get('/app/view/:id', practice.checkSession, indexCtrl.viewapp);
    app.post('/app/apply', indexCtrl.apply);
    app.get('/approval', indexCtrl.approval);
    /** end:应用 **/

    /** start:消息模板 **/
    app.get('/template', tempCtrl.index);
    app.get('/template/new',tempCtrl.create);
    /** end:消息模板 **/

    /** start:api **/

    /** end:api **/
    app.locals.brushRespones = function (data, definitions) {

    }
}

