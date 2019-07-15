const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const Router = require('koa-router');
const app = new Koa(); // 实例化koa
const router = new Router();
// 设置前缀，这样下面就不用每次都写/user了
const userRouter = new Router({prefix: '/user'});

// 内存数据库
const db = [{name: '李雷'}];

router.get('/', (ctx) => {
    ctx.body = "这是主页"
});

// 获取用户列表
userRouter.get('/', (ctx) => {
    ctx.body = db;
});

// 增加用户
userRouter.post('/', (ctx) => {
    db.push(ctx.request.body);
    ctx.body = ctx.request.body;
});

// 获取特定用户
userRouter.get('/:id', (ctx) => {
    ctx.body = db[+ctx.params.id];
});

// 修改特定用户
userRouter.put('/:id', (ctx) => {
    db[+ctx.params.id] = ctx.request.body;
    ctx.body = ctx.request.body;
});

// 删除用户
userRouter.delete('/:id', (ctx) => {
    db.splice(+ctx.params.id, 1);
    ctx.status = 204; // 没有内容，但是成功了
});

// 启动路由
app.use(bodyparser());
app.use(router.routes());
app.use(userRouter.routes());
app.use(userRouter.allowedMethods());


app.listen(3000, () => {
    console.log(`start server...`);
});
