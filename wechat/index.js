const WeChat = require('../wechat-lib');
const Config = require('../config/config');
const Mongoose = require('mongoose');
const Token = Mongoose.model('Token');

const WeChatConfig = {
    weChat: {
        appID: Config.WECHAT.AppID,
        appSecret: Config.WECHAT.AppSecret,
        token: Config.WECHAT.Token,
        getAccessToken: async () => {
            const res = await Token.getAccessToken();
            return res;
        },
        saveAccessToken: async (data) => {
            const res = await Token.saveAccessToken(data);
            return res;
        }
    }
}

exports.test = async ()=> {
    console.log('wechat test')
    const client = new WeChat(WeChatConfig.weChat)
    const data = await client.fetchAccessToken()
    
    console.log('dataindb',data)    

}     