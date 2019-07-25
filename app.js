const Koa = require('koa')
const wechat = require('./wechat-lib/middleware')
const config = require('./config/config')
const app = new Koa()

console.log(555,config)
app.use(wechat(config.WECHAT))

app.listen(3006)

console.log('run localhost:' + 3006)