const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa(); // 实例化koa

// 接受一个函数，该函数为一个中间件
app.use(async (ctx, next) => {
    console.log(1);
    await next();
    console.log(2);
    ctx.body = 'hello world';
});

app.use(async (ctx, next) => {
    console.log(3);
    await next();
    console.log(4);
})

app.use(async (ctx) => {
    console.log(5);
})

app.listen(3000, () => {
    console.log(`start server...`);
});
