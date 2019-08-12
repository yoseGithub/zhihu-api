const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({prefix: '/users'});
const { find, findById, create, update, delete: del, login, checkOwner } = require('../controllers/users');

const { secret} = require('../config');

// 认证中间件
const auth = jwt({ secret });

// 获取用户列表
router.get('/', find);

// 获取特定用户
router.get('/:id', findById);

// 增加用户
router.post('/', create);

// 修改特定用户
router.patch('/:id', auth, checkOwner, update);

// 删除用户
router.delete('/:id', auth, checkOwner, del);

// 登陆
router.post('/login', login);

module.exports = router;
