const Koa = require('koa')
const wechat = require('./wechat-lib/middleware')
const config = require('./config/config')
const reply = require('./wechat/reply')
const { InitSchemas, connect } = require('./app/database/init');


;(async () => {
    await connect(config.db).catch()
    
    InitSchemas()
    
    console.log(555, test())
    const { test } = require('./wechat/index')
    //测试token的数据库存储
    await test()
    const app = new Koa()
    
    console.log(555,config)
    app.use(wechat(config.WECHAT, reply))
    
    app.listen(3006)
    
    console.log('run localhost:' + 3006)
})()