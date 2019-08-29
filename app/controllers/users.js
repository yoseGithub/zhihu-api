const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/users'); // 数据库模型导出
const { secret } = require('../config');

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
            password: { type: 'string', required: true }
        });

        // 查重
        const { name } = ctx.request.body;
        const requesteUser = await User.findOne({ name });

        if(requesteUser) ctx.throw(409, '用户已经存在');

        // save方法，保存到数据库。并根据 RESTful API最佳实践，返回增加的内容
        const user = await new User(ctx.request.body).save();
        ctx.body = user;
    }

    async update (ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: false },
            password: { type: 'string', required: false },
            avatar_url: { type: 'string', require: false },
            gender: { type: 'string', require: false },
            headline: { type: 'string', require: false },
            locations: { type: 'array',itemType: 'string', require: false },
            business: { type: 'string', require: false },
            employments: { type: 'array',itemType: 'object', require: false },
            educations: { type: 'array',itemType: 'object', require: false }
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

    async login (ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: true },
            password: { type: 'string', required: true }
        });

        const user = await User.findOne(ctx.request.body);
        if(!user) ctx.throw(401, '用户名或密码不正确');

        const { _id, name } = user;
        const token = jsonwebtoken.sign({ _id, name }, secret, { expiresIn: '1d' });
        ctx.body = { token };
    }

    async checkOwner (ctx, next) {
        if (ctx.params.id !== ctx.state.user._id) ctx.throw('403', '没有权限');

        await next();
    }
}

module.exports = new UsersCtl();
