class HomeCtl {
    index (ctx) {
        ctx.body = "这是主页";
    }
    upload (ctx) {
        console.log(ctx)
        const file = ctx.request.files.file;
        console.log(file)
        ctx.body = {
            path: file.path
        };
    }
}

module.exports = new HomeCtl();
