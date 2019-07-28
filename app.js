const Koa = require('koa')
const wechat = require('./wechat-lib/middleware')
const config = require('./config/config')
const reply = require('./wechat/reply')
const app = new Koa()

console.log(555,config)
app.use(wechat(config.WECHAT, reply))

app.listen(3006)

console.log('run localhost:' + 3006)