const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({prefix: '/questions'});
const { find, findById, create, update, delete: del,checkQuestionExist, checkQuestioner } = require('../controllers/questions');

const { secret } = require('../config');

// 认证中间件
const auth = jwt({ secret });

// 获取问题列表
router.get('/', find);

// 增加问题
router.post('/', auth, create);

// 获取特定问题
router.get('/:id',checkQuestionExist, findById);

// 修改特定问题
router.patch('/:id', auth, checkQuestionExist, checkQuestioner, update);

// 删除问题
router.delete('/:id', auth, checkQuestionExist, checkQuestioner, del);

module.exports = router;
