var koa = require('koa');
var router = require('koa-router')();
var data = require('../lib/user-data.js');
var app = module.exports = koa(); //required in order to be able to reference the functions below in another file

router.get('/user', function* (){
    this.body = yield data.users.get();
});
app.use(router.routes());
app.listen(3000);