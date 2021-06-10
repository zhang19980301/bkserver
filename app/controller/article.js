'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
    async addArticle() {
        const { ctx } = this;
        let responce = await this.service.article.addArticle()
        ctx.body = responce;
    }
}

module.exports = HomeController;