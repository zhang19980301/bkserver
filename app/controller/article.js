'use strict';

const Controller = require('egg').Controller;
const ID3 = require('nodejs-id3-reader');
const path = require('path');
const fs_walk = require('fs-walk');
class HomeController extends Controller {
  async addArticle() {
    const { ctx } = this;
    const responce = await this.service.article.addArticle();
    ctx.body = responce;
  }
  async getArticle() {
    const { ctx } = this;
    // id3Reader.loadTags('../public/music/ceshi.mp3', () => {
    //   console.log(123);
    // });
    fs_walk.walkSync('C:\\Users\\38134\\Desktop\\app\\bkserver\\app\\public\\music', function(basedir, filename, stat) {
      console.log('walkSync: basedir=' + basedir + ' filename=' + filename);
      if (stat.isDirectory()) {
        console.log('walkSync: skip dir');
      } else if (!filename.endsWith('.mp3')) {
        console.log('walkSync: skip non-mp3 file');
      } else {
        const absPath = path.join(basedir, filename);
        ID3.localTags(absPath, data => {
          // console.log(data);
          ctx.body = data;
        });
        // console.dir(tags);
        // const album = tags.album;
        // const title = tags.title;
        // const artist = tags.artist;
        // const trackNumber = Number(tags.trackNumber);
        // ctx.body = { absPath, album, artist, title, trackNumber };
      }
    });
  }
}

module.exports = HomeController;
