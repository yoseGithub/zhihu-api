const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const app = new Koa(); // 实例化koa
const routes = require('./routes');

// 启动路由
app.use(bodyparser());
routes(app);

app.listen(3000, () => {
    console.log(`start server...`);
});
