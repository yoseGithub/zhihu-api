const User = require('../models/users');

class UsersCtl {
    async find (ctx) {
        ctx.body = await User.find();
    }

    async findById (ctx) {
        const user = await User.findById(ctx.params.id);
        if(!user) ctx.throw(404, '用户不存在');
        ctx.body = user;
    }

    async create (ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: true },
            age: { type: 'number', required: false }
        });
        
        const user = await new User(ctx.request.body).save();
        ctx.body = user;
    }

    update (ctx) {
        if (+ctx.params.id >= db.length) {
            ctx.throw(412, '先决条件失败：id 大于数组条件长度'); // 等价于上面三句话
        }

        ctx.verifyParams({
            name: {
                type: 'string',
                required: true
            },
            age: {
                type: 'number',
                required: false
            }
        });

        db[+ctx.params.id] = ctx.request.body;
        ctx.body = ctx.request.body;
    }

    delete (ctx) {
        if (+ctx.params.id >= db.length) {
            ctx.throw(412, '先决条件失败：id 大于数组条件长度'); // 等价于上面三句话
        }

        db.splice(+ctx.params.id, 1);
        ctx.status = 204; // 没有内容，但是成功了
    }
}

module.exports = new UsersCtl();
