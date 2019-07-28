const Sha1 = require('sha1');
const GetRawBody = require('raw-body');
const Util = require('./util');

module.exports = (opts, reply)=>{
    return async (context, next)=>{
        console.log(777,opts)
        console.log(6666,context)
        let {
            signature,
            timestamp,
            nonce,
            echostr
        } = context.query;
        const Token = opts.Token;
        let str = [Token, timestamp, nonce].sort().join('');
        const Sha = Sha1(str); 
        if("GET" === context.method){
            if(Sha === signature){
                context.body = echostr;
            }else{
                context.body = "Falied";
            }            
        }else if("POST" === context.method){
            if(Sha !== signature){
                return (context.body = "Falied");
            }
            const Data = await GetRawBody(context.req, {
                length: context.length,
                limit: '1mb',
                encoding: context.charset,
            });
            const Content = await Util.ParseXML(Data);
            const Message = Util.FormatMessage(Content.xml);
            context.weixin = Message;

            await reply.apply(context, [context, next]);
            const ReplyBody = context.body;
            const Msg = context.weixin;
            const Xml = Util.Tpl(ReplyBody, Msg);
            context.status = 200;
            context.type = "application/xml";
            // const Xml = `
            //      <xml>
            //         <ToUserName><![CDATA[${Message.FromUserName}]]></ToUserName>
            //         <FromUserName><![CDATA[${Message.ToUserName}]]></FromUserName>
            //         <CreateTime>${parseInt(new Date().getTime() /1000, 0) + ''}</CreateTime>
            //         <MsgType><![CDATA[text]]></MsgType>
            //         <Content><![CDATA[${Message.Content}]]></Content>
            //         <MsgId>1234567890123456</MsgId>
            //     </xml>
            // `
            context.body = Xml;
        }
    };
};