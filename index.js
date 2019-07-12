const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa(); // 实例化koa
const router = new Router();
// 设置前缀，这样下面就不用每次都写/user了
const userRouter = new Router({prefix: '/user'});

// 模拟的用户安全，作为安全层
const auth = async (ctx, next) => {
    // 异常前置，如果url地址中是/user/visitor，将会被拦截
    if(ctx.params.id === 'visitor') {
        ctx.throw(401);
    }

    await next();
}

// 接受一个函数，该函数为一个中间件
// app.use(async (ctx) => {
//     if (ctx.url === '/') {
//         ctx.body = "这是主页";
//     } else if (ctx.url === '/user') {
//         if (ctx.method === 'GET') {
//             ctx.body = '这是用户列表页';
//         } else if (method === 'POST') {
//             ctx.body = '创建用户页';
//         } else {
//             ctx.status = 405; // 直接设置405状态，页面会简单的出现默认的 Method Not Allowed
//             ctx.body = '不允许该方法'; // 这是相当于实现一个自定义的405页面
//         }
//     } else if (ctx.url.match(/\/user\/\w+/)) {
//         const userId = ctx.url.match(/\/user\/(\w+)/)[1];
//         ctx.body = `用户${userId}`;
//     } else {
//         ctx.status = 404; // 直接设置404状态，页面会简单的出现默认的 Not Found
//         ctx.body = "page not found!" // 这是相当于实现一个自定义的404页面
//     }
// });

router.get('/', auth, (ctx) => {
    ctx.body = "这是主页"
});

userRouter.get('/', auth, (ctx) => {
    ctx.body = "这是用户列表"
});

userRouter.post('/', auth, (ctx) => {
    ctx.body = "创建用户页"
});

userRouter.get('/:id', auth, (ctx) => {
    ctx.body = `用户${ctx.params.id}`;
});

// 启动路由
app.use(router.routes());
app.use(userRouter.routes());
app.use(userRouter.allowedMethods());


app.listen(3000, () => {
    console.log(`start server...`);
});
