// 内存数据库
const db = [{name: '李雷'}];

class UsersCtl {
    find (ctx) {
        a.b;
        ctx.body = db;
    }

    findById (ctx) {
        if (+ctx.params.id >= db.length) {
            // ctx.body = '先决条件失败：id 大于数组条件长度';
            // ctx.status = 412;
            // return;

            ctx.throw(412, '先决条件失败：id 大于数组条件长度'); // 等价于上面三句话
        }

        ctx.body = db[+ctx.params.id];
    }

    create (ctx) {
        db.push(ctx.request.body);
        ctx.body = ctx.request.body;
    }

    update (ctx) {
        db[+ctx.params.id] = ctx.request.body;
        ctx.body = ctx.request.body;
    }

    delete (ctx) {
        db.splice(+ctx.params.id, 1);
        ctx.status = 204; // 没有内容，但是成功了
    }
}

module.exports = new UsersCtl();
