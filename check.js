const Koa = require('koa')
const sha1 = require('sha1')
const config = {
    wechat: {
        appID: 'wxd01c78b523f3e6f1',
        appSecret: '17a4be58b6038c93918331a3a3d46e3a',
        token: '36b9eee1c029484c3122e261dcd04f'
    }
}

const app = new Koa()

app.use(async (ctx, next) => {
    const {
        signature,
        timestamp,
        nonce,
        echostr
    } = ctx.query

    const token = config.wechat.token
    let str = [token,timestamp, nonce].sort().join('')
    const sha = sha1(str)

    if(sha === signature) {
        ctx.body = echostr
    } else {
        ctx.body = 'wrong'
    }
})

app.listen(3006)

console.log('Listen:' + 3006)