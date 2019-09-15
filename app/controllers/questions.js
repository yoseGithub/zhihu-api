const Question = require('../models/questions'); // 数据库模型导出

class QuestionsCtl {
    async find (ctx) {
        const { per_page = 10 } = ctx.query;
        const page =  Math.max(+ctx.query.page, 1) - 1;
        const perPage = Math.max(+ctx.query.per_page, 1);
        const q = new RegExp(ctx.query.q)
        ctx.body = await Question.find( { $or: [{ title: q }, { description: q }] }).limit(perPage).skip(page * perPage); // limit: 返回多少数量，skip：跳过多少数量
    }

    async findById (ctx) {
        const { fields = '' } = ctx.query;
        const selectFields = fields.split(';').filter(item => item).map(item => ' +'+item).join('');
        const question = await Question.findById(ctx.params.id).select(selectFields).populate('questioner');
        if(!question) ctx.throw(404, '问题不存在');
        ctx.body = question;
    }

    async create (ctx) {
        ctx.verifyParams({
            title: { type: 'string', required: true },
            description: { type: 'string', required: false }
        });

        const question = await new Question({...ctx.request.body, questioner: ctx.state.user._id }).save();
        ctx.body = question;
    }

    async update (ctx) {
        ctx.verifyParams({
            title: { type: 'string', required: false },
            description: { type: 'string', require: false }
        });

        await ctx.state.question.update(ctx.request.body);
        ctx.body = ctx.state.question;
    }

    async delete (ctx) {
        await Question.findByIdAndRemove(ctx.params.id);
        ctx.status = 204; // 没有内容，但是成功了
    }

    async checkQuestionExist (ctx, next) {
        const question = await Question.findById(ctx.params.id).select('+questioner');
        if(!question) ctx.throw(404, '问题不存在');
        ctx.state.question = question;
        await next();
    }

    async checkQuestioner (ctx, next) {
        const { question } = ctx.state;
        if (question.questioner.toString() !== ctx.state.user._id) ctx.throw(403, '没有权限');
        await next();
    }
}

module.exports = new QuestionsCtl();
