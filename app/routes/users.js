const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({prefix: '/users'});
const { find, findById, create, update, delete: del, login,
    checkOwner, listFollowing, follow, unfollow, listFollowers, checkUserExist,
    followTopic, unfollowTopic, listFollowingTopics, listQuestions,
    listLikingAnswers, likeAnswer, unlikeAnswer,
    listDisLikingAnswers, dislikeAnswer, undislikeAnswer } = require('../controllers/users');

const { checkTopicExist } = require('../controllers/topics');
const { checkAnswerExist } = require('../controllers/answers');

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
router.delete('/following/:id', auth, checkUserExist, unfollow);

// 获取关注话题列表
router.get('/:id/listFollowingTopics', listFollowingTopics);

// 关注某话题
router.put('/followingTopic/:id', auth, checkTopicExist, followTopic);

// 取消关注某话题
router.delete('/followingTopic/:id', auth, checkTopicExist, unfollowTopic);

// 获取问题列表
router.get('/:id/questions', checkUserExist, listQuestions)

// 获取喜欢的答案列表
router.get('/:id/likingAnswers', listLikingAnswers);

// 点赞答案
router.put('/likingAnswers/:id', auth, checkAnswerExist, likeAnswer, undislikeAnswer);

// 取消点赞答案
router.delete('/likingAnswers/:id', auth, checkAnswerExist, unlikeAnswer);

// 获取踩的答案列表
router.get('/:id/dislikingAnswers', listDisLikingAnswers);

// 踩答案
router.put('/dislikingAnswers/:id', auth, checkAnswerExist, dislikeAnswer, unlikeAnswer);

// 取消踩答案
router.delete('/dislikingAnswers/:id', auth, checkAnswerExist, undislikeAnswer);


module.exports = router;
