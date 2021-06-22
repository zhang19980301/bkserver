/* eslint-disable no-undef */
/* eslint-disable eqeqeq */
'use strict';
const Service = require('egg').Service;
const { Md5s } = require('../public/js/crypto');
const { Cryptos } = require('../public/js/crypto-web');
const jwt = require('jsonwebtoken');
class UserService extends Service {
  async addUser() {
    try {
      const userstr = (this.ctx.request.body.s);
      const userlist = JSON.parse(Cryptos.decode(userstr));
      const oncepass = Cryptos.decode(userlist.password);
      const obj = {
        loginName: userlist.loginname,
        password: Md5s.encode(oncepass).encstr,
        key: Md5s.encode(oncepass).key,
        nicName: userlist.username,
      };
      let returnlist = await this.app.mysql.get('users', { loginName: userlist.username });
      try {
        returnlist.id;
        returnlist = {
          code: '400',
          message: '当前用户名已被注册，请重新输入',
        };
        return returnlist;
      } catch (error) {

        let returnlist = await this.app.mysql.insert('users', obj);
        // eslint-disable-next-line eqeqeq
        if (returnlist.insertId != '') {
          returnlist = {
            code: 200,
            message: '添加成功',
          };
        } else {
          returnlist = {
            code: '400',
            message: '添加错误，未知原因',
          };
        }
        return returnlist;
      }
    } catch (error) {
      const returnlist = {
        code: 400,
        message: '请不要传递未经加密的参数',
      };
      return returnlist;
    }
  }
  async delUser() {
    const token = this.ctx.header.token;
    const obj = this.ctx.request.body;
    const secretOrPrivateKey = 'zhangsuqi';
    let returnlist = null;
    jwt.verify(token, secretOrPrivateKey, function(err) {
      if (err) { //  时间失效的时候/ 伪造的token
        returnlist = false;
      } else {
        returnlist = true;
      }
    });
    if (returnlist) {
      const result = await this.app.mysql.delete('users', {
        id: obj.id,
      });
      try {
        result.affectedRows;
        returnlist = {
          code: 200,
          message: '删除成功',
        };
      } catch (error) {
        returnlist = {
          code: 400,
          message: '删除失败',
        };
      }
    } else {
      returnlist = {
        code: 403,
        message: 'token失效',
      };
    }
    return returnlist;
  }
  async loginUser() {
    let userstr = this.ctx.request.body.s;
    userstr = userstr.replace(' ', '+');
    const userlist = JSON.parse(Cryptos.decode(userstr));
    try {
      global[userlist.date];
      // eslint-disable-next-line eqeqeq
      if (global[userlist.date] == userlist.imgCode) {
        let returnlist = await this.app.mysql.get('users', { loginName: userlist.username });
        try {
          returnlist.id;
          const pass = Md5s.decode(returnlist.password, returnlist.key);
          if (Cryptos.decode(userlist.password) == pass) {
            const content = { name: userlist.username }; // 要生成token的主体信息
            const secretOrPrivateKey = 'zhangsuqi'; // 这是加密的key（密钥）
            const token = jwt.sign(content, secretOrPrivateKey, {
              expiresIn: 1000 * 60 * 1, // 1小时过期
            });
            delete global[userlist.date]; // 验证码使用完直接删除  2清理缓存    1防止5分钟内重复使用--在生成页已经做过处理
            returnlist = {
              code: 200,
              message: '登录成功',
              obj: {
                token,
                id: returnlist.id,
                loginName: returnlist.loginName,
                status: returnlist.status,
              },
            };
          } else {
            returnlist = {
              code: 400,
              message: '密码错误',
            };
          }
          return returnlist;
        } catch (err) {
          returnlist = {
            code: 400,
            message: '该用户没有注册清先去注册',
          };
        }
        return returnlist;
      }
      const returnlist = {
        code: 400,
        message: '验证码错误',
      };
      return returnlist;

    } catch (error) {
      returnlist = {
        code: 400,
        message: '验证码失效',
      };
    }
  }
  async updateUser() {
    const token = this.ctx.header.token;
    const secretOrPrivateKey = 'zhangsuqi';
    let returnlist = null;
    const obj = JSON.parse(Cryptos.decode(this.ctx.request.body.s));
    console.log(obj);
    // let loginName = obj.loginname
    jwt.verify(token, secretOrPrivateKey, function(err) {
      if (err) { // 时间失效的时候/ 伪造的token
        returnist = false;
      } else {
        // if (decode.name == loginName) {
        returnlist = true;
        // } else {
        //     returnlist = false
        // }
      }
    });
    if (returnlist) {
      let returnlist = await this.app.mysql.get('users', { id: obj.id });
      if (returnlist.password == Cryptos.decode(obj.password)) {
        const updatelist = await this.app.mysql.update('users', {
          id: returnlist.id,
          loginName: returnlist.loginName,
          status: returnlist.status,
          nicName: obj.username ? obj.username : returnlist.nicName,
        });
        try {
          updatelist.affectedRows;
          returnlist = { code: 200, message: '修改成功' };
        } catch (error) {
          returnlist = { code: 200, message: '修改失败' };
        }
      } else {
        const updatelist = await this.app.mysql.update('users', {
          id: returnlist.id,
          key: Md5s.encode(obj.password).key,
          loginName: returnlist.loginName,
          status: returnlist.status,
          password: Md5s.encode(obj.password).encstr,
          nicName: obj.username ? obj.username : returnlist.nicName,
        });
        try {
          updatelist.affectedRows;
          returnlist = { code: 200, message: '修改成功' };
        } catch (error) {
          returnlist = { code: 200, message: '修改失败' };
        }
      }
      return returnlist;
    }
    returnlist = {
      code: 403,
      message: 'token失效',
    };

    return returnlist;
  }
  async getAllUsers() {

    // let id=this.ctx.request.body.id
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
  async getuserByid() {
    const token = this.ctx.header.token;
    const secretOrPrivateKey = 'zhangsuqi';
    const obj = this.ctx.request.body;
    let returnlist = null;
    // let obj = JSON.parse(Cryptos.decode(this.ctx.request.body.s))
    // let loginName = obj.username
    jwt.verify(token, secretOrPrivateKey, function(err) {
      if (err) { //  时间失效的时候/ 伪造的token
        returnist = false;
      } else {
        // if (decode.name == loginName) {
        returnlist = true;
        // } else {
        //     returnlist = false
        // }
      }
    });
    if (returnlist) {
      returnlist = await this.app.mysql.get('users', { id: obj.id });
      returnlist = {
        code: 200,
        obj: {
          nicName: returnlist.nicName,
          loginName: returnlist.loginName,
          password: returnlist.password,
        },
      };
    } else {
      returnlist = {
        code: 400,
        message: 'token失效',
      };
    }
    return returnlist;
  }
}

module.exports = UserService;
