const crypto = require('crypto');
const iv = Buffer.alloc(16, 0);
const buf = crypto.randomBytes(16);
class Md5s {
  encode(password) {
    const secret = buf.toString('hex');
    const key = crypto.scryptSync(password, secret, 24);
    const cipher = crypto.createCipheriv('aes192', key, iv); // 设置加密类型 和 要使用的加密密钥
    let encstr = cipher.update(password, 'utf8', 'hex'); // 编码方式从utf-8转为hex;
    encstr += cipher.final('hex'); // 编码方式从转为hex;
    return { encstr, key };
  }
  decode(encpass, arrstr) {
    const decipher = crypto.createDecipheriv('aes192', arrstr, iv);
    let decstr = decipher.update(encpass, 'hex', 'utf8'); // 编码方式从hex转为utf-8;
    decstr += decipher.final('utf8'); // 编码方式从utf-8;
    return decstr;
  }
}


exports.Md5s = new Md5s();
