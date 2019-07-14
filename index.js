const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const Router = require('koa-router');
const app = new Koa(); // 实例化koa
const router = new Router();
// 设置前缀，这样下面就不用每次都写/user了
const userRouter = new Router({prefix: '/user'});

router.get('/', (ctx) => {
    ctx.body = "这是主页"
});

// post(增)、delete(删)、put(改)、get(查)
// 获取用户列表
userRouter.get('/', (ctx) => {
    // 应该返回查询的数据
    ctx.body = [
        {name: '韩梅梅'},
        {name: '李蕾'}
    ];
});

// 获取特定用户
userRouter.get('/:id', (ctx) => {
    ctx.body = `用户${ctx.params.id}`;
});

// 增加/新建用户
userRouter.post('/', (ctx) => {
    // 新建用户，应该返回新建的对象
    ctx.body = {name: '韩梅梅'};
});

// 修改用户
userRouter.put('/', (ctx) => {
    ctx.body = {name: '涵美眉'};
});

// 删除用户
userRouter.delete('/', (ctx) => {
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
