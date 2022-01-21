'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async registUser() {
    const { ctx } = this;
    const responce = await this.service.users.addUser();
    ctx.body = responce;
  }
  async loginUser() {
    const { ctx } = this;
    const responce = await this.service.users.loginUser();
    ctx.body = responce;
  }
  async delUser() {
    const { ctx } = this;
    const responce = await this.service.users.delUser();
    ctx.body = responce;
  }
  async updateUser() {
    const { ctx } = this;
    const responce = await this.service.users.updateUser();
    ctx.body = responce;
  }
  async all() {
    const { ctx } = this;
    ctx.body = ctx.request.headers['x-forwarded-for'] || ctx.request.connection;
  }
  async getAllUsers() {
    const { ctx } = this;
    const responce = await this.service.users.getAllUsers();
    // console.log(responce)
    ctx.body = { code: 200, message: '请求成功', data: responce.returnlist, totle: responce.length };
  }
  async getuserByid() {
    const { ctx } = this;
    const responce = await this.service.users.getuserByid();
    ctx.body = responce;
  }
}

module.exports = HomeController;
