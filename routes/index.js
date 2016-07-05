var indexCtrl = require('../controller/indexCtrl'),
    appCtrl = require('../controller/appCtrl'),
    config = require('../libs/config'),
    practice = require('../libs/practice'),
    u = require("underscore");

module.exports = function (app) {
    /** start:Oauth **/
    app.get('/', function (req, res) {
        res.render('login');
    });
    app.get('/oauth', indexCtrl.oauth);
    app.get('/apis', indexCtrl.apis);
    /** end:Oauth **/

    /** start:api **/
    app.get('/apis/db/:sid', practice.checkSession, indexCtrl.apisOfService);
    app.get('/apis/detail/:sid', practice.checkSession, indexCtrl.detailOfApi);
    /** end:api **/

    /** start:我的服务 **/
    app.get('/my/app', practice.checkSession, appCtrl.getMyApp);

    app.get('/my/app/new', practice.checkSession, appCtrl.addMyApp);
    app.post('/my/app/update', practice.checkSession, appCtrl.updateMyApp);
    app.get('/my/app/update/:id', practice.checkSession, appCtrl.updateMyAppPage);
    app.post('/my/app/refresh', practice.checkSession, appCtrl.refreshMyApp);
    app.post('/my/app/checkname', practice.checkSession, appCtrl.checkMyAppName);
    app.post('/my/app/save', practice.checkSession, appCtrl.saveMyApp);
    app.post('/my/app/delete', practice.checkSession, appCtrl.deleteMyApp);
    app.post('/my/app/applyline', practice.checkSession, appCtrl.applyMyApp);
    app.post('/my/app/visible', practice.checkSession, appCtrl.applyMyAppVisible);
    app.get('/my/app/p/:serviceid/:menu', practice.checkSession, appCtrl.getMyAppSetup);

    app.get('/my/app/:pagenum', practice.checkSession, appCtrl.getMyApp);

    app.get('/my/api/add/:serviceid', practice.checkSession, appCtrl.addMyAppAPI);

    app.post('/my/api/getapi', practice.checkSession, appCtrl.getMyAppAPI);
    app.post('/my/api/save', appCtrl.saveMyAppAPI);
    /** end:我的服务 **/

    app.locals.brushRespones = function (data, definitions) {
        var key = data.schema.$ref.split('/definitions/')[1],
            value = definitions[key],
            rt = {}; //处理后返回的数据

        function eachRespones(prop, rt) {  //遍历返回数据模型
            for (var v in prop) {
                if (prop[v].type == 'array') {
                    rt[v] = [];
                    if(!u.isEmpty(prop[v].properties)) {
                        eachRespones(prop[v].properties, rt[v]);
                    }
                }
                else if (prop[v].type == 'object') {
                    rt[v] = {};
                    if(!u.isEmpty(prop[v].properties)) {
                        eachRespones(prop[v].properties, rt[v]);
                    }
                }
                else {
                    rt[v] = prop[v].format;
                }
            }
            return rt;
        }
        eachRespones(value.properties, rt);
        return JSON.stringify(rt, null, 2);
    }

    app.locals.brushResponesTable = function (data, definitions) {
        var key = data.schema.$ref.split('/definitions/')[1],
            value = definitions[key],
            rt = {}; //处理后返回的数据

        var html = '';
        function eachRespones(prop) {  //遍历返回数据模型
            for (var v in prop) {
                html += '<ul class="ul-tree"><li>';
                if(!u.isEmpty(prop[v].properties)) {
                    html += '<span><i class="fa fa-minus-square-o"></i> ' + v + '</span>';
                }
                else {
                    html += '<span><span class="first-node">└</span> ' + v + '</span>';
                }
                html += '<span class="li-right" style="width: 250px;">' + prop[v].description + '</span>';
                html += '<span class="li-right" style="width: 120px;">' + prop[v].format + '</span>';
                html += '<span class="li-right" style="width: 120px;">' + prop[v].type + '</span></li>';
                if(!u.isEmpty(prop[v].properties)) {
                    html += '<li>';
                    eachRespones(prop[v].properties);
                    html += '</li>';
                }
                html += '</ul>';
            }
        }
        eachRespones(value.properties);
        return html;
    }
}

