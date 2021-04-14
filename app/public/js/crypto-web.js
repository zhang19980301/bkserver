const crypto = require('crypto-js');
let key = crypto.enc.Utf8.parse("nihaozhangsuqi12"); //十六位十六进制数作为密钥   长度必须为4 的倍数
let iv = crypto.enc.Utf8.parse("nihaozhangsuqi12"); //成功
class Cryptos {
  encode(data) {
    const keys = key;
    const ivs = iv;
    const encrypted = crypto.AES.encrypt(data, keys, {
      iv: ivs,
      mode: crypto.mode.CBC,
      padding: crypto.pad.Pkcs7,
    });
    // that
    return encrypted.toString();
  }
  decode(encrypted) {
    const keys = key;
    const ivs = iv;
    const decrypted = crypto.AES.decrypt(encrypted, keys, {
      iv: ivs,
      mode: crypto.mode.CBC,
      padding: crypto.pad.Pkcs7,
    });
    return decrypted.toString(crypto.enc.Utf8);
  }
}


exports.Cryptos = new Cryptos();
