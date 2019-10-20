const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/users'); // 数据库模型导出
const Question = require('../models/questions');
const Answer = require('../models/answers');
const { secret } = require('../config');

class UsersCtl {    
    async find (ctx) {
        const { per_page = 10 } = ctx.query;
        const page =  Math.max(+ctx.query.page, 1) - 1;
        const perPage = Math.max(+ctx.query.per_page, 1);
        ctx.body = await User.find({ name: new RegExp(ctx.query.q) }).limit(perPage).skip(page * perPage); // limit: 返回多少数量，skip：跳过多少数量
    }

    async findById (ctx) {
        const { fields = '' } = ctx.query;
        const selectFields = fields.split(';').filter(item => item).map(item => ' +'+item).join('');
        const populateStr = fields.split(';').filter(item => item).map(item => {
            if (item === 'employments') {
                return 'employments.company employments.job';
            }

            if (item === 'educations') {
                return 'educations.school educations.major'
            }

            return item;
        }).join(' ');

        const user = await User.findById(ctx.params.id).select(selectFields).populate(populateStr);
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

    async checkUserExist (ctx, next) {
        const user = await User.findById(ctx.params.id);
        if(!user) ctx.throw(404, '用户不存在');

        await next();
    }

    async listFollowing (ctx) {
        const user = await User.findById(ctx.params.id).select('+following').populate('following');
        if(!user) ctx.throw(404, '用户不存在');
        ctx.body = user.following;
    }

    async listFollowers (ctx) {
        const users = await User.find({ following: ctx.params.id }); // 查找following包含自己id的用户
        ctx.body = users;
    }

    async follow (ctx) {
        const me = await User.findById(ctx.state.user._id).select('+following');
        // me 会拿到当前用户信息，拿到后再去查询一下是否关注的对象是否已经在关注数组里，如果没有就添加进关注数组里并保存
        // 否则关注者的数组里会存在多个已关注对象
        // 由于following数组里保存的是 schema 对象，所以需要使用将其变换成字符串来查重
        if(!me.following.map(id => id.toString()).includes(ctx.params.id)) {
            me.following.push(ctx.params.id);
            me.save();
        }
        ctx.status = 204;
    }

    async unfollow (ctx) {
        const me = await User.findById(ctx.state.user._id).select('+following');
        const index = me.following.map(id => id.toString()).indexOf(ctx.params.id);
        if(index > -1) {
            me.following.splice(index, 1);
            me.save();
        }
        ctx.status = 204;
    }

    // 话题关注列表
    async listFollowingTopics (ctx) {
        const user = await User.findById(ctx.params.id).select('+followingTopics').populate('followingTopics');

        if(!user) ctx.throw(404, '用户不存在');
        ctx.body = user.followingTopics;
    }

    async followTopic (ctx) {
        const me = await User.findById(ctx.state.user._id).select('+followingTopics');
        if(!me.followingTopics.map(id => id.toString()).includes(ctx.params.id)) {
            me.followingTopics.push(ctx.params.id);
            me.save();
        }
        ctx.status = 204;
    }

    async unfollowTopic (ctx) {
        const me = await User.findById(ctx.state.user._id).select('+followingTopics');
        const index = me.followingTopics.map(id => id.toString()).indexOf(ctx.params.id);
        if(index > -1) {
            me.followingTopics.splice(index, 1);
            me.save();
        }
        ctx.status = 204;
    }

    async listQuestions (ctx) {
        const questions = await Question.find({ questioner: ctx.params.id });
        ctx.body = questions;
    }

    // 答案点赞列表
    async listLikingAnswers (ctx) {
        const user = await User.findById(ctx.params.id).select('+likingAnswers').populate('likingAnswers');

        if(!user) ctx.throw(404, '用户不存在');
        ctx.body = user.likingAnswers;
    }

    async likeAnswer (ctx, next) {
        const me = await User.findById(ctx.state.user._id).select('+likingAnswers');
        if(!me.likingAnswers.map(id => id.toString()).includes(ctx.params.id)) {
            me.likingAnswers.push(ctx.params.id);
            me.save();
            // 赞同数加1
            await Answer.findByIdAndUpdate(ctx.params.id, { $inc: { voteCount: 1 } });
        }
        ctx.status = 204;
        await next();
    }

    async unlikeAnswer (ctx) {
        const me = await User.findById(ctx.state.user._id).select('+likingAnswers');
        const index = me.likingAnswers.map(id => id.toString()).indexOf(ctx.params.id);
        if(index > -1) {
            me.likingAnswers.splice(index, 1);
            me.save();
            // 赞同数减1
            await Answer.findByIdAndUpdate(ctx.params.id, { $inc: { voteCount: -1 } });
        }
        ctx.status = 204;
    }

    // 答案不认同列表（踩）
    async listDisLikingAnswers (ctx) {
        const user = await User.findById(ctx.params.id).select('+dislikingAnswers').populate('dislikingAnswers');

        if(!user) ctx.throw(404, '用户不存在');
        ctx.body = user.dislikingAnswers;
    }

    async dislikeAnswer (ctx, next) {
        const me = await User.findById(ctx.state.user._id).select('+dislikingAnswers');
        if(!me.dislikingAnswers.map(id => id.toString()).includes(ctx.params.id)) {
            me.dislikingAnswers.push(ctx.params.id);
            me.save();
        }
        ctx.status = 204;
        await next();
    }

    async undislikeAnswer (ctx) {
        const me = await User.findById(ctx.state.user._id).select('+dislikingAnswers');
        const index = me.dislikingAnswers.map(id => id.toString()).indexOf(ctx.params.id);
        if(index > -1) {
            me.dislikingAnswers.splice(index, 1);
            me.save();
        }
        ctx.status = 204;
    }

    // 收藏答案列表
    async listCollectAnswers (ctx) {
        const user = await User.findById(ctx.params.id).select('+collectingAnswers').populate('collectingAnswers');

        if(!user) ctx.throw(404, '用户不存在');
        ctx.body = user.collectingAnswers;
    }

    async collectAnswer (ctx, next) {
        const me = await User.findById(ctx.state.user._id).select('+collectingAnswers');
        if(!me.collectingAnswers.map(id => id.toString()).includes(ctx.params.id)) {
            me.collectingAnswers.push(ctx.params.id);
            me.save();
        }
        ctx.status = 204;
        await next();
    }

    async uncollectAnswer (ctx) {
        const me = await User.findById(ctx.state.user._id).select('+collectingAnswers');
        const index = me.collectingAnswers.map(id => id.toString()).indexOf(ctx.params.id);
        if(index > -1) {
            me.collectingAnswers.splice(index, 1);
            me.save();
        }
        ctx.status = 204;
    }
}

module.exports = new UsersCtl();
