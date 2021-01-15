/* eslint valid-jsdoc: "off" */

'use strict';

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
  config.keys = appInfo.name + '_1607352373893_5657';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
  };

  config.multipart = {
    mode: 'file',
    fileExtensions: ['.ttf', '.otf', '.ttc', '.jpg', '.png', '.mp3'], // 扩展几种上传的文件格式
  };

  config.mongoose = {
    client: {
      url: 'mongodb://127.0.0.1/DESIGN_PORTAL',
      options: {},
      // mongoose global plugins, expected a function or an array of function and options
      plugins: [],
    },
  }

  config.security = {
    csrf: {
      enable: false,
    }
  }

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    // 下面这条加上才能共享跨域session，同时前端ajax请求也要加上响应的参数
    credentials: true, 
  };

  config.oss = {
    client: {
      accessKeyId: '',
      accessKeySecret: '',
      bucket: '',
      endpoint: '',
      timeout: '60s',
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
