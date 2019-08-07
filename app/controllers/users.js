const User = require('../models/users');

class UsersCtl {
    async find (ctx) {
        ctx.body = await User.find().select("-password");
    }

    async findById (ctx) {
        const user = await User.findById(ctx.params.id);
        if(!user) ctx.throw(404, '用户不存在');
        ctx.body = user;
    }

    async create (ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: true },
            password: { type: 'string', required: true }
        });

        // 查重
        const { name } = ctx.request.body;
        const requesteUser = await user.findOne({ name });

        if(requesteUser) ctx.throw(409, '用户已经存在');

        // save方法，保存到数据库。并根据 RESTful API最佳实践，返回增加的内容
        const user = await new User(ctx.request.body).save();
        ctx.body = user;
    }

    async update (ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: false },
            password: { type: 'string', required: false }
        });

        // findByIdAndUpdate，第一个参数为要修改的数据id，第二个参数为修改的内容
        const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        if(!user) ctx.throw(404, '用户不存在');
        ctx.body = user;
    }

    async delete (ctx) {
        const user = await User.findByIdAndRemove(ctx.params.id);
        if(!user) ctx.throw(404, '用户不存在');
        ctx.status = 204; // 没有内容，但是成功了
    }
}

module.exports = new UsersCtl();
