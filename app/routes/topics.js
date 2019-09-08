const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({prefix: '/topics'});
const { find, findById, create, update } = require('../controllers/topics');

const { secret } = require('../config');

// 认证中间件
const auth = jwt({ secret });

// 获取话题列表
router.get('/', find);

// 增加话题
router.post('/', auth, create);

// 获取特定话题
router.get('/:id', findById);

// 修改特定话题
router.patch('/:id', auth, update);

module.exports = router;
