const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const error = require('koa-json-error');
const parameter = require('koa-parameter');
const app = new Koa(); // 实例化koa
const routes = require('./routes');

// 错误处理中间件
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        // 如果没捕获到状态码，证明是服务器内部错误
        ctx.status = err.status || err.statusCode || 500;
        ctx.body = {
            message: err.message
        }
    }
});

app.use(error({
    // 后置的修改返回格式
    postFormat: (err, {stack, ...rest}) => process.env.NODE_ENV === 'production' ? rest : {stack, ...rest}
    // postFormat: function (err, obj) {
    //     if (process.env.NODE_ENV === 'production') {
    //         delete obj.stack
    //         return obj;
    //     }
    //     return obj;
    // }
}));
app.use(bodyparser());
app.use(parameter(app));
routes(app);

app.listen(3000, () => {
    console.log(`start server...`);
});
