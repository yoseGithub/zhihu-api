const Koa = require('koa');
const koaBody = require('koa-body');
const error = require('koa-json-error');
const parameter = require('koa-parameter');
const mongoose = require('mongoose');
const path = require('path');
const app = new Koa(); // 实例化koa
const routes = require('./routes');
const { connectionStr, connectionLocal } = require('./config.js');

// 连接 mongoDB
// mongoose.connect(connectionStr, { useNewUrlParser: true } , () => console.log('MongoDB 连接成功'));
mongoose.connect(connectionLocal, { useNewUrlParser: true } , () => console.log('MongoDB 连接成功'));
// 打印错误信息
mongoose.connection.on('error', console.error);

// 错误处理中间件
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        // 如果没捕获到状态码，证明是服务器内部错误
        ctx.status = err.status || err.statusCode || 500;
        ctx.body = {
            message: err.message
        }
    }
});

app.use(error({
    // 后置的修改返回格式
    postFormat: (err, {stack, ...rest}) => process.env.NODE_ENV === 'production' ? rest : {stack, ...rest}
    // postFormat: function (err, obj) {
    //     if (process.env.NODE_ENV === 'production') {
    //         delete obj.stack
    //         return obj;
    //     }
    //     return obj;
    // }
}));

app.use(
    koaBody({
        multipart: true, // 启用文件
        formidable: {
            uploadDir: path.join(__dirname, '../public/uploads'), // 上传路径
            keepExtensions: true // 保留拓展名
        }
    })
);

app.use(parameter(app));
routes(app);

app.listen(3000, () => {
    console.log(`start server...`);
});
