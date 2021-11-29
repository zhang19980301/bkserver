/* eslint-disable no-empty */
/* eslint-disable eqeqeq */
'use strict';

const { Controller } = require('egg');
const svgCaptcha = require('svg-captcha');
const { Mail } = require('../public/js/email');
const { Md5s } = require('../public/js/crypto')
const { Cryptos } = require('../public/js/crypto-web')
const jsmediatags = require('jsmediatags');
const fs = require('fs')
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
        await this.app.redis.set(ctx.query.date, cap.text.toLowerCase())
        console.log(await this.app.redis.get(ctx.query.date))
        // 给图片验证码设置一个过期时间 --设置为5分钟过期
        // 把存在全局中的验证码删掉
        setInterval(async () => {
          await this.app.redis.del(ctx.query.date)
        }, 5 * 60 * 1000);
        ctx.response.type = 'image/svg+xml'; // 设置返回头的类型
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
      let email = Cryptos.decode(ctx.request.body.email)
      const obj = await Mail.sendEmail('欢迎注册博客', email);
      if (obj.response.indexOf('OK')) {
        ctx.body = { code: 200, message: '发送成功' };
      } else {
        ctx.body = { code: 400, message: '发送失败' };
      }
    } catch (error) {
      ctx.body = { code: 500, message: '缺少必填参数' };
    }
  }
  async getAllMusic(){
    const { ctx } = this
    function getfile(){
      return new Promise((success, failed) => {
        fs.readdir(process.cwd()+'/app/public/music/', 'utf8' ,(err, res) => {
          if(err){
            failed(err)
          }else{
            success(res)
          }
        })
      })
    }
    try {
      // console.log(process.cwd()+`/app/public/music/${item}`)
      let arr = await getfile()
      function info(arr){
        let obj = []
        return new Promise((success, error) => {
          arr.forEach(item => {
            jsmediatags.read(process.cwd()+`/app/public/music/${item}`, {
              onSuccess: (tag) => {
                //文件内包含的专辑封面是base64格式的图片，获取后转成jpeg格式缓存到cache文件夹内。
                obj.push({
                  title: item,
                  name: tag.tags.title,
                  artist: tag.tags.artist,
                  album: tag.tags.album,
                })
                success(obj)
              },
              onError: (error) => {
                console.log(error)
              }
            })
            
          })
        })
      }
      ctx.body = { code: 200, message: '成功', data: await info(arr) };
    } catch (error) {
      ctx.body = { code: 500, message: '读取文件失败' };
    }
  }
  async music(){
    const { ctx } = this;
    fs.readFile(process.cwd()+`/app/public/music/${ctx.request.url.split('/')[2]}`,(err, res) => {
      
    })
  }
}
module.exports = PublicController;
