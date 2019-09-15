const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({prefix: '/topics'});
const { find, findById, create, update, checkTopicExist, listTopicsFollowers } = require('../controllers/topics');

const { secret } = require('../config');

// 认证中间件
const auth = jwt({ secret });

// 获取话题列表
router.get('/', find);

// 增加话题
router.post('/', auth, create);

// 获取特定话题
router.get('/:id',checkTopicExist, findById);

// 修改特定话题
router.patch('/:id', auth, checkTopicExist, update);

// 获取当前话题下的关注者
router.get('/:id/followers', checkTopicExist, listTopicsFollowers)

module.exports = router;
