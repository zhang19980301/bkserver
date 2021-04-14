// 引入模块依赖
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
// 创建 token 类
class Jwt {
  constructor(data) {
    this.data = data;

  }

  // 生成token
  generateToken() {
    const data = this.data;
    const cert = fs.readFileSync('../ssl/4348137_www.suqi.ltd.pem');// 私钥 可以自己生成
    const token = jwt.sign({
      data,
      exp: 60 * 60 * 1,
    }, cert, { algorithm: 'RS256' });
    return token;
  }

  // 校验token
  verifyToken() {
    const token = this.data;
    const cert = fs.readFileSync(path.join(__dirname, '../ssl/4348137_www.suqi.ltd.pem'));// 公钥 可以自己生成
    let res;
    try {
      const result = jwt.verify(token, cert, { algorithms: [ 'RS256' ] }) || {};
      let { exp = 0 } = result,
        current = Math.floor(Date.now() / 1000);
      if (current <= exp) {
        res = result.data || {};
      }
    } catch (e) {
      res = 'err';
    }
    return res;
  }
}

exports.Jwt = new Jwt();
