const Fontmin = require('fontmin');
const fs = require('fs');
const path = require('path');

function extract(options) {
  const {
    fontPath,
    text,
    fontFamily, // font-family
    toCss = false, // 是否转换为css代码
    isAddFont = false, // 是否是添加字体时的提取 如果是 则保存到preview目录
  } = options
  // console.log('extract', fontPath, text)
  return new Promise((resolve, reject) => {
    const fontmin = new Fontmin()
    .src(fontPath)
    .use(Fontmin.glyph({ 
        text,
        // hinting: false // keep ttf hint info (fpgm, prep, cvt). default = true
    }));

    if (toCss) {
      fontmin.use(Fontmin.css({
        base64: true, // 开启 base64 嵌入，默认关闭
        asFileName: !fontFamily,
        fontFamily: fontFamily,
      }))
    }
    
    fontmin.run(function (err, files) {
      // console.log('err', err, files)
      if (err) {
          reject()
          return
      }
      if (toCss)
        resolve(files[1].contents.toString());
      else {
        const pathSplit = fontPath.split('/');

        let extPath = 'preview';

        if (!isAddFont) {
          extPath = formatTime(Date.now(), 'yyyyMMdd');
        }


        const fontExtDirPath = path.join(__dirname, '../public/fontsExt');

        if (!fs.existsSync(fontExtDirPath)) {
          fs.mkdirSync(fontExtDirPath);
        }
    
        const fontExtDateDirPath = path.join(fontExtDirPath, extPath);
        if (!fs.existsSync(fontExtDateDirPath)) {
          fs.mkdirSync(fontExtDateDirPath);
        }



        let fileName = pathSplit[pathSplit.length - 1];


        if (!isAddFont) {
          const nameSplit = fileName.split('.');
          const fontType = nameSplit[nameSplit.length - 1];
          const fileId = `${Date.now()}${Math.floor(Math.random() * Math.floor(10000))}`;
          fileName = `${fileId}.${fontType}`;
        }

        const filePath = path.join(fontExtDateDirPath, fileName);

        fs.writeFileSync(filePath, files[0].contents);

        const publicPath = `/public/fontsExt/${extPath}/${fileName}`

        resolve(publicPath)
      }
    });
  })
}

function formatTime(dateTime, format = 'yyyy-MM-dd hh:mm:ss') {
  if (!dateTime) return
  if (typeof dateTime === 'string') {
    dateTime  = new Date(dateTime).getTime()
  } else {
    dateTime  = new Date(dateTime).getTime()
  }
  let re = /-?\d+/
  let m = re.exec(dateTime)
  let d = new Date(parseInt(m[0]))
  let o = {
    'M+': d.getMonth() + 1,
    'd+': d.getDate(),
    'h+': d.getHours(),
    'm+': d.getMinutes(),
    's+': d.getSeconds(),
    'q+': Math.floor((d.getMonth() + 3) / 3),
    'S': d.getMilliseconds()
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    }
  }
  return format
}

module.exports = extract
