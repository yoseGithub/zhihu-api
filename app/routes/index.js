// node自带模块，用于读取文件
const fs = require('fs');

module.exports = app => {
    // 返回一个包含指定目录下所有文件名称的数组对象，会把当前文件也读取进去
    fs.readdirSync(__dirname).forEach(file => {
        if(file === 'index.js') return;

        const route = require(`./${file}`);
        app.use(route.routes()).use(route.allowedMethods());
    });
}