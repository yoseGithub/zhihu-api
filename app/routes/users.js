const Router = require('koa-router');
const router = new Router({prefix: '/user'});
const { find, findId, create, update, delete: del } = require('../controllers/users');

// 获取用户列表
router.get('/', find);

// 增加用户
router.post('/', findId);

// 获取特定用户
router.get('/:id', create);

// 修改特定用户
router.put('/:id', update);

// 删除用户
router.delete('/:id', del);

module.exports = router;
