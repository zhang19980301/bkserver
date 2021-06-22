'use strict';
const Service = require('egg').Service;
// const { Md5s } = require('../public/js/crypto');
// const { Cryptos } = require('../public/js/crypto-web');
// const jwt = require('jsonwebtoken');
class ArticleService extends Service {
  async addArticle() {
    const pagelist = this.ctx.request.body.pagelist; // 每页条数
    const page = this.ctx.request.body.pageNo; // 当前查询页
    const sql = `select id,nicName,loginName,status from users   limit ${((page - 1) * pagelist)},${pagelist}`;
    const s = await this.app.mysql.select('users');
    // let returnlist = await this.app.mysql.select("users",{
    //     columns:['id','nicName','loginName','status'],
    //     orders: [
    //         ['id', 'asc'] //降序desc，升序asc
    //     ],
    //     limt:pagelist-1,
    //     // offset:((page*pagelist)-pagelist)+(page-1)
    //     offset:5
    // })
    const returnlist = await this.app.mysql.query(sql);
    return { returnlist, length: s.length };
  }
}

module.exports = ArticleService;
