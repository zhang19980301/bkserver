/* eslint-disable no-empty */
/* eslint-disable eqeqeq */
'use strict';

const { Controller } = require('egg');
const svgCaptcha = require('svg-captcha');
const { Mail } = require('../public/js/email');
const { Md5s } = require('../public/js/crypto')
class PublicController extends Controller {
  async imgCode() {
    const { ctx } = this;
    // console.log(Md5s.encode('sdajdbasjbda'))
    const cap = svgCaptcha.create({
      size: 4,
      inverse: false,
      fontSize: 36,
      width: 100,
      height: 30,
      color: false,
      ignoreChars: '0o1i',
      background: '#fff',
    });
    try {
      if (ctx.query.date == '' || ctx.query.date == ' ') {
        ctx.body = { code: 200, message: '请求必填参数（date）不能为空' };
      } else {
        console.log(Md5s.encode('sdajdbasjbda'))
        global[ctx.query.date] = cap.text.toLowerCase();
        // 给图片验证码设置一个过期时间 --设置为5分钟过期
        // 把存在全局中的验证码删掉
        setInterval(() => {
          delete global[ctx.query.date];
        }, 5 * 60 * 1000);
        ctx.response.type = 'image/svg+xml'; // 知道你个返回的类型
        ctx.body = cap.data; // 返回一张图片
      }
    } catch (err) {
      ctx.body = { code: 200, message: '请求必填参数（date）不能为空' };
    }
  }
  async encode() {
    const { ctx } = this;
    ctx.body = 123;
  }
  async sendEmail() {
    const { ctx } = this;
    try {
      const obj = await Mail.sendEmail('欢迎注册博客', '381344750@qq.com', ctx.request.body.date);
      if (obj.response.indexOf('OK')) {
        ctx.body = { code: 200, message: '发送成功' };
      } else {
        ctx.body = { code: 400, message: '发送失败' };
      }
    } catch (error) {
      ctx.body = { code: 500, message: '缺少必填参数' };
    }
  }
}
module.exports = PublicController;
