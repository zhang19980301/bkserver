'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // 用户注册
  router.post('/regist', controller.user.registUser);
  // 用户登录
  router.post('/login', controller.user.loginUser);
  // 删除用户
  router.post('/delUser/:id', controller.user.delUser);
  // 修改用户
  router.post('/updateUser', controller.user.updateUser);
  // 返回图片验证码
  router.get('/imgCode', controller.public.imgCode);
  // router.post('/sendEmail', controller.public.sendEmail);
  // 获取所有用户数据
  router.post('/getAllUsers', controller.user.getAllUsers);
  // 通过id获取用户信息
  router.post('/getuserByid', controller.user.getuserByid);
  // 根据提供的字符串以及以及密钥对需要进行加密的字符串进行加密
  // router.post("/getEncode",controller.public.encode);
  router.post('/addArticle', controller.article.addArticle);
  // 发送邮箱验证码
  router.post('/sendEmail', controller.public.sendEmail);
  // 获取所有文件夹中的音乐列表
  router.post("/getAllMusic", controller.public.getAllMusic)
  // 劫持所有/music的请求
  router.get("/musics/*", controller.public.music)
};
