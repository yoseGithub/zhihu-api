const Topic = require('../models/topics'); // 数据库模型导出

class TopicsCtl {
    async find (ctx) {
<<<<<<< HEAD
        const { per_page = 10 } = ctx.query;
        const page =  Math.max(+ctx.query.page, 1) - 1;
        const perPage = Math.max(+ctx.query.per_page, 1);
        ctx.body = await Topic.find({ name: new RegExp(ctx.query.q) }).limit(perPage).skip(page * perPage); // limit: 返回多少数量，skip：跳过多少数量
=======
        ctx.body = await Topic.find();
>>>>>>> section-11.3
    }

    async findById (ctx) {
        const { fields = '' } = ctx.query;
        const selectFields = fields.split(';').filter(item => item).map(item => ' +'+item).join('');
        const topic = await Topic.findById(ctx.params.id).select(selectFields);        
        if(!topic) ctx.throw(404, '话题不存在');
        ctx.body = topic;
    }

    async create (ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: true },
            avatar_url: { type: 'string', required: false },
            introduction: { type: 'string', required: false }
        });

        const { name } = ctx.request.body;
        const requesteTopic = await Topic.findOne({ name });

        if(requesteTopic) ctx.throw(409, '话题已经存在');

        const topic = await new Topic(ctx.request.body).save();
        ctx.body = topic;
    }

    async update (ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: false },
            avatar_url: { type: 'string', require: false },
            introduction: { type: 'string', require: false }
        });

        // findByIdAndUpdate，第一个参数为要修改的数据id，第二个参数为修改的内容
        const topic = await Topic.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        if(!topic) ctx.throw(404, '话题不存在');
        ctx.body = topic;
    }
}

module.exports = new TopicsCtl();
