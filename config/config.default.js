/* eslint valid-jsdoc: "off" */

'use strict';

const os = require('os');
// const path = require('path');
// 获取本机ip
function getIpAddress() {
  // os.networkInterfaces() 返回一个对象，该对象包含已分配了网络地址的网络接口

  const interfaces = os.networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
}


/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
	 * built-in config
	 * @type {Egg.EggAppConfig}
	 **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1614323644750_6626';

  // add your middleware config here
  config.gzip = {
    threshold: 1024,
  };
  // 开放post请求
  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
    domainWhiteList: [ '*' ], // []中放放出的白名单，*代表所有
  };
  // 使用的中间件  [开启哪个写哪个]
  config.middleware = [ 'gzip' ];
  // 配置服务器开的地址以及端口
  config.cluster = {
    listen: {
      path: '',
      port: 4010,
      hostname: getIpAddress(),
    },
    https: {
      key: './app/public/ssl/5443214_zzzsuqi.cn.key',
      cert: './app/public/ssl/5443214_zzzsuqi.cn_public.crt'
    }
  };
  config.mysql = {
    // 单数据库信息配置
    client: {
      // host
      host: 'zzzsuqi.cn',
      // 端口号
      port: '3306',
      // 用户名
      user: 'root',
      // 密码
      password: 'Zhang.123',
      // 数据库名
      database: 'bk',
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  };
  config.redis = {
    client: {
      port: 6379,
      host: 'zzzsuqi.cn',
      password: '',
      db: 0
    }
  }
  config.static = { // 必须把public移出项目，否则在pkg的包中egg的static中间件会有对public操作（确保文件夹），会有抛错
    prefix: '/',
    dir: process.cwd() + '/app/public', // 配置静态文件的地址
  };
  // add your user config here
  const userConfig = {
    myAppName: 'bk',
  };

  return {
    ...config,
    ...userConfig,
  };
};
