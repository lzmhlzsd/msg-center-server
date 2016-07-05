/**
 * Created by lukaijie on 16/5/12.
 */
exports.checkSession = function (req, res, next) {
    console.log('进入session验证');
    //req.session.shopexid = '13917609856';
    if (typeof(req.session.shopexid) != 'undefined') {
        if (req.session.shopexid != "") {
            next();
        }
        else {
            res.redirect('/');
        }
    }
    else {
        res.redirect('/');
    }
}