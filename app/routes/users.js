const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({prefix: '/users'});
const { find, findById, create, update, delete: del, login,
    checkOwner, listFollowing, follow, unfollow, listFollowers, checkUserExist, followTopic, unfollowTopic, listFollowingTopics } = require('../controllers/users');
const { checkTopicExist } = require('../controllers/topics');

const { secret } = require('../config');

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

// 获取关注列表
router.get('/:id/following', listFollowing);

// 获取粉丝
router.get('/:id/followers', checkUserExist, listFollowers)

// 关注某人
router.put('/following/:id', auth, checkUserExist, follow);

// 取消关注某人
router.put('/unfollowing/:id', auth, checkUserExist, unfollow);

// 获取关注话题列表
router.get('/:id/listFollowingTopics', listFollowingTopics);

// 关注某话题
router.put('/followingTopic/:id', auth, checkTopicExist, followTopic);

// 取消关注某话题
router.put('/unfollowingTopic/:id', auth, checkTopicExist, unfollowTopic);

module.exports = router;
