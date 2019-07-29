const request = require('request-promise')

const base = 'https://api.weixin.qq.com/cgi-bin/';
const api = {
    accessToken: base + 'token?grant_type=client_credential',
}

module.exports = class Wechat {
    
    constructor (opts) {
        console.log(444, opts)
        this.opts = Object.assign({}, opts);
        this.appID = opts.appID;
        this.appSecret = opts.appSecret;
        this.getAccessToken = opts.getAccessToken;
        this.saveAccessToken = opts.saveAccessToken;
        this.fetchAccessToken()
    }

    async request(options) {
        options = Object.assign({}, options, {json: true})
        try {
            const res =await request(options)
            return res
        } catch (err) {
            console.log(err)
        }
    }

    async fetchAccessToken() {
        let data = await this.getAccessToken()
       
        if(!this.isValidToken(data)) {
            data = await this.updateAccessToken()
        }

        return data
    }

    async updateAccessToken() {
        const url = `${api.accessToken}&appid=${this.appID}&secret=${this.appSecret}`
        const data = await this.request({url})

        const now = new Date().getTime()
        console.log('update',data)
        const expiresIn = now + (data.expires_in - 20) * 1000
        data.expiresIn = expiresIn

        await this.saveAccessToken(data)
        return data
    }

    isValidToken(data) {
        if(!data || !data.expires_in) {
            return false
        }

        const expiresIn = data.expires_in
        const now = new Date.getTime()

        if(now < expiresIn) {
            return true
        } else {
            return false
        }
    }
}