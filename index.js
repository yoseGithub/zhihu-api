const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa(); // 实例化koa

// 接受一个函数，该函数为一个中间件
app.use(async (ctx) => {
    if (ctx.url === '/') {
        ctx.body = "这是主页";
    } else if (ctx.url === '/user') {
        if (ctx.method === 'GET') {
            ctx.body = '这是用户列表页';
        } else if (method === 'POST') {
            ctx.body = '创建用户页';
        } else {
            ctx.status = 405; // 直接设置405状态，页面会简单的出现默认的 Method Not Allowed
            ctx.body = '不允许该方法'; // 这是相当于实现一个自定义的405页面
        }
    } else if (ctx.url.match(/\/user\/\w+/)) {
        const userId = ctx.url.match(/\/user\/(\w+)/)[1];
        ctx.body = `用户${userId}`;
    } else {
        ctx.status = 404; // 直接设置404状态，页面会简单的出现默认的 Not Found
        ctx.body = "page not found!" // 这是相当于实现一个自定义的404页面
    }
});

app.listen(3000, () => {
    console.log(`start server...`);
});
