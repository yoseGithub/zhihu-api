const Router = require('koa-router');
const router = new Router({prefix: '/users'});
const { find, findById, create, update, delete: del } = require('../controllers/users');

// 获取用户列表
router.get('/', find);

// 获取特定用户
router.get('/:id', findById);

// 增加用户
router.post('/', create);

// 修改特定用户
router.patch('/:id', update);

// 删除用户
router.delete('/:id', del);

module.exports = router;
