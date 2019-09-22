const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({prefix: '/questions/:questionId/answers'});
const { find, findById, create, update, delete: del,checkAnswerExist, checkAnswerer } = require('../controllers/answers');

const { secret } = require('../config');

// 认证中间件
const auth = jwt({ secret });

// 获取问题列表
router.get('/', find);

// 增加问题
router.post('/', auth, create);

// 获取特定问题
router.get('/:id',checkAnswerExist, findById);

// 修改特定问题
router.patch('/:id', auth, checkAnswerExist, checkAnswerer, update);

// 删除问题
router.delete('/:id', auth, checkAnswerExist, checkAnswerer, del);

module.exports = router;
