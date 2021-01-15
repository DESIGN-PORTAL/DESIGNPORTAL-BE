<h2 align="center">
 DESIGN PORTAL BACK-END
</h2>

----

## 简介
DESIGN PORTAL项目服务端
使用egg-js脚手架搭建

## 预览地址
[www.designportal.cn](http://www.designportal.cn)

## 前端项目地址
[https://github.com/DESIGN-PORTAL/DESIGNPORTAL](https://github.com/DESIGN-PORTAL/DESIGNPORTAL)


## 注意事项
1. 安装mongodb，数据库使用mongodb

1. 配置oss
```
图片上传使用了阿里云oss，需要在 /config/config.default.js 中配置
  config.oss = {
    client: {
      accessKeyId: '',  // 你的accessKeyId
      accessKeySecret: '',  // 你的accessKeySecret
      bucket: '',  // 你的bucket
      endpoint: '',  // 你的endpoint
      timeout: '60s',
    },
  };
```