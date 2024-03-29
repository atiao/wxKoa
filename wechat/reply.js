// let { resolve } = require('path');
// let commonMenu = require('./menu');
// const Config = require('../config');
// const Api = require('../app/api');

// const Help = '欢迎关注koaMovie\n' +
//     '回复 1-3，测试文字回复\n' +
//     '回复 4，测试图片回复\n' +
//     '回复 首页，进入网站首页\n' +
//     '回复 电影名字，查询电影信息\n' +
//     '点击帮助，获取帮助信息\n' +
//     '某些功能呢订阅号无权限，比如网页授权\n' +
//     '回复语音，查询电影信息\n' +
//     '也可以点击' + Config.BASE_URL + '/sdk' + '语音查电影，查询电影信息\n';

module.exports = async (context, next) => {
    const Message = context.weixin;

    // let mp = require('../wechat');

    // let client = mp.getWeChat();

    if ('text' === Message.MsgType) {
        let content = Message.Content;
        let reply = "接收文本消息～";
        if ("koaMovie" === content) {
            const CountData = await Api.wechat.saveMpUser(Message, content);
            let user = CountData.user;
            let count = CountData.count;
            let nickname = user.nickname;
            let guess = " 我猜不出你来自哪里......";
            if ("1" == user.gender) {
                nickname = `小哥哥 - ${nickname}`;
            } else if ("2" == user.gender) {
                nickname = `小姐姐  - ${nickname}`;
            }
            if (user.province || user.city) {
                guess = `我猜你来自${user.province}省${user.city}市`;
            }
            let end = `${guess}，哈哈，这些信息只有你关注我才能从微信服务器拿到~`;
            reply = `哎呦喂，你是来自${content}的${nickname}，你的同伴有${count}个，${end}`;
        }
        else if ("1" === content) {
            reply = "1. 我喜欢你";
        } else if ("2" === content) {
            reply = "2. 我喜欢你";
        } else if ("3" === content) {
            reply = "3. 我喜欢你";
        } else if ("4" === content) {
            let data = await client.handle('uploadMaterial', 'image', resolve(__dirname, '../2.jpg'));
            reply = {
                type: 'image',
                mediaId: data.media_id,
            };
        } else if ("5" === content) {
            let data = await client.handle('uploadMaterial', 'video', resolve(__dirname, '../6.mp4'));
            reply = {
                type: 'video',
                title: "回复的视频标题",
                description: "吃个鸡？",
                mediaId: data.media_id,
            };
        } else if ("6" === content) {
            let data = await client.handle('uploadMaterial', 'video', resolve(__dirname, '../6.mp4'), {
                type: 'video',
                description: '{"title": "吃个鸡？", "introduction": "吃个鸡？"}'
            });
            reply = {
                type: 'video',
                title: "吃个鸡？",
                description: "吃个鸡？",
                mediaId: data.media_id,
            };
            if (!data.media_id) {
                reply = "公众号尚未通过微信认证，无法调用接口～";
            }
        } else if ("7" === content) {
            let data = await client.handle('uploadMaterial', 'image', resolve(__dirname, '../2.jpg'), {
                type: 'image',
            });
            reply = {
                type: 'image',
                mediaId: data.media_id,
            };
            if (!data.media_id) {
                reply = "公众号尚未通过微信认证，无法调用接口～";
            }
        } else if ("8" === content) {
            let data = await client.handle('uploadMaterial', 'image', resolve(__dirname, '../2.jpg'), {
                type: 'image',
            });
            let data2 = await client.handle('uploadMaterial', 'pic', resolve(__dirname, '../2.jpg'), {
                type: 'image',
            });
            let media = {
                articles: [
                    {
                        "title": "这是服务端上传的图文 1",
                        "thumb_media_id": data.media_id,
                        "author": "Angus",
                        "digest": "没有摘要",
                        "show_cover_pic": 1,
                        "content": "点击去往我的博客",
                        "content_source_url": "http://www.feihu1996.cn",
                    },
                    {
                        "title": "这是服务端上传的图文 2",
                        "thumb_media_id": data.media_id,
                        "author": "Angus",
                        "digest": "没有摘要",
                        "show_cover_pic": 1,
                        "content": "点击去往GitHub",
                        "content_source_url": "https://github.com/",
                    },
                ],
            };
            let uploadData = await client.handle('uploadMaterial', "news", media, {});

            let newMedia = {
                media_id: uploadData.media_id,
                index: 0,
                articles: {
                    "title": "这是服务端上传的图文 1",
                    "thumb_media_id": data.media_id,
                    "author": "Angus",
                    "digest": "没有摘要",
                    "show_cover_pic": 1,
                    "content": "点击去往我的博客",
                    "content_source_url": "http://www.feihu1996.cn",
                },
            };

            await client.handle('updateMaterial', uploadData.media_id, newMedia);

            let newsData = await client.handle('fetchMaterial', uploadData.media_id, 'news', {});

            let items = newsData.news_item;
            let news = [];

            if (items) {
                items.forEach(item => {
                    news.push(
                        {
                            title: item.title,
                            description: item.description,
                            picUrl: data2.url,
                            url: item.url,
                        },
                    );
                });
            }

            reply = news;

            if (!data.media_id) {
                reply = "公众号尚未通过微信认证，无法调用接口～";
            }
        } else if ("9" === content) {
            let counts = await client.handle('countMaterial');
            let res = await Promise.all([
                client.handle('batchMaterial', {
                    type: 'image',
                    offset: 0,
                    count: 10,
                }),
                client.handle('batchMaterial', {
                    type: 'video',
                    offset: 0,
                    count: 10,
                }),
                client.handle('batchMaterial', {
                    type: 'voice',
                    offset: 0,
                    count: 10,
                }),
                client.handle('batchMaterial', {
                    type: 'news',
                    offset: 0,
                    count: 10,
                }),
            ]);
            reply = `
            image: ${res[0].total_count}
            video: ${res[1].total_count}
            voice: ${res[2].total_count}
            news: ${res[3].total_count}
            `;
            if (!res[0].total_count) {
                reply = "公众号尚未通过微信认证，无法调用接口～";
            }
        } else if ("10" === content) {
            let newTag = await client.handle("createTag", "测试标签");

            await client.handle("updateTag", newTag.tag ? newTag.tag.id : 1, "还是测试标签");

            let tagsData = await client.handle('fetchTags');

            await client.handle('batchUsersTag', [Message.FromUserName], newTag.tag ? newTag.tag.id : 1);

            let tagUsers = await client.handle('fetchTagUsers', newTag.tag ? newTag.tag.id : 1);
            let userTags = await client.handle('getUserTags', Message.FromUserName);

            await client.handle('batchUsersTag', [Message.FromUserName], newTag.tag ? newTag.tag.id : 1, true);

            await client.handle("delTag", newTag.tag ? newTag.tag.id : 1);

            reply = JSON.stringify(tagsData);
            if (!tagsData.tags) {
                reply = "公众号尚未通过微信认证，无法调用接口～";
            }
        } else if ("11" === content) {
            let users = await client.handle('getUsers');
            reply = `用户总数：${users.total}`;
            if (!users.total) {
                reply = "11.公众号尚未通过微信认证，无法调用接口～";
            }
        } else if ("12" === content) {
            let res = await client.handle('remarkUser', Message.FromUserName, 'MENTOR');
            reply = `${!res.errcode ? '您的备注现在是MENTOR' : '12.公众号尚未通过微信认证，无法调用接口～'}`;
        } else if ("13" === content) {
            let data = await client.handle('getUserInfo', Message.FromUserName);
            reply = `${data.openid ? JSON.stringify(data) : '13.公众号尚未通过微信认证，无法调用接口～'}`;
        } else if ("14" === content) {
            let data = await client.handle('batchUserInfo', user_list = [
                {
                    openid: Message.FromUserName,
                    lang: 'zh_CN',
                },
            ]);
            reply = `${data.user_info_list ? JSON.stringify(data) : '14.公众号尚未通过微信认证，无法调用接口～'}`;
        } else if ("15" === content) {
            let tempQrData = {
                expire_seconds: 604800,
                action_name: "QR_SCENE",
                action_info: {
                    scene: {
                        scene_id: 123,
                    }
                }
            };
            let tempTicketData = await client.handle('createQrcode', tempQrData);
            let tempQr = client.showQrcode(tempTicketData.ticket);
            reply = tempTicketData.ticket ? tempQr : '15.公众号尚未通过微信认证，无法调用接口～';
        } else if ("16" === content) {
            let qrData = {
                action_name: "QR_SCENE",
                action_info: {
                    scene: {
                        scene_id: 99,
                    }
                }
            };
            let ticketData = await client.handle('createQrcode', qrData);
            let qr = client.showQrcode(ticketData.ticket);
            reply = ticketData.ticket ? qr : '16.公众号尚未通过微信认证，无法调用接口～';
        } else if ("17" === content) {
            let longUrl = "http://shang.qq.com/email/stop/email_stop.html?qq=3027677825&sig=083194b1effe19859c6add1d0e4e72e4b634b33db21a3d2c&tttt=1";
            let shortUrlData = await client.handle('createShortUrl', longUrl);
            reply = shortUrlData.short_url ? shortUrlData.short_url : '17.公众号尚未通过微信认证，无法调用接口～';
        } else if ("18" === content) {
            let semanticData = {
                query: '查一下明天从北京到上海的南航机票',
                city: '北京',
                category: 'flight,hotel',
                uid: Message.FromUserName,
            };
            let searchData = await client.handle('semantic', semanticData);
            reply = !searchData.errcode ? JSON.stringify(searchData) : '18.公众号尚未通过微信认证，无法调用接口～';
        } else if ("19" === content) {
            let body = "兰洁，我喜欢你。";
            let data = await client.handle('aiTranslate', body, 'zh_CN', 'en_US');
            reply = data.to_content ? data.to_content : '19.公众号尚未通过微信认证，无法调用接口～';
        } else if ("20" === content) {
            try {
                await client.handle('deleteMenu');
                let menu = {
                    button: [
                        {
                            name: '一级菜单',
                            sub_button: [
                                {
                                    name: '二级菜单_1',
                                    type: 'click',
                                    key: 'no_1',
                                },
                                {
                                    name: '二级菜单_2',
                                    type: 'click',
                                    key: 'no_2',
                                },
                                {
                                    name: '二级菜单_3',
                                    type: 'click',
                                    key: 'no_3',
                                },
                                {
                                    name: '二级菜单_4',
                                    type: 'click',
                                    key: 'no_4',
                                },
                                {
                                    name: '二级菜单_5',
                                    type: 'click',
                                    key: 'no_5',
                                },
                            ],
                        },
                        {
                            name: '分类',
                            type: 'view',
                            url: 'http://www.feihu1996.cn/',
                        },
                        {
                            name: `新菜单_${Math.random()}`,
                            type: 'click',
                            key: 'new_111',
                        },
                    ],
                };
                let data = await client.handle('createMenu', menu);
                reply = !data.errcode ? '自定义菜单创建成功~' : '20.公众号尚未通过微信认证，无法调用接口～';
            } catch (e) {
                console.log(e);
            }
        } else if ("21" === content) {
            try {
                await client.handle('deleteMenu');
                let menu = {
                    button: [
                        {
                            name: '发图扫码',
                            sub_button: [
                                {
                                    name: '系统拍照发图',
                                    type: 'pic_sysphoto',
                                    key: 'rselfmenu_1_0',
                                },
                                {
                                    name: '拍照或者相册发图',
                                    type: 'pic_photo_or_album',
                                    key: 'rselfmenu_1_1',
                                },
                                {
                                    name: '微信相册发图',
                                    type: 'pic_weixin',
                                    key: 'rselfmenu_1_2',
                                },
                                {
                                    name: '扫码推',
                                    type: 'scancode_push',
                                    key: 'rselfmenu_0_1',
                                },
                                {
                                    name: '扫码带提示',
                                    type: 'scancode_waitmsg',
                                    key: 'rselfmenu_0_0',
                                },
                            ],
                        },
                        {
                            name: '分类',
                            type: 'view',
                            url: 'http://www.feihu1996.cn/',
                        },
                        {
                            name: `其他`,
                            sub_button: [
                                {
                                    name: '点击',
                                    type: 'click',
                                    key: "no_110",
                                },
                                {
                                    name: '地理位置',
                                    type: "location_select",
                                    key: 'no_111'
                                },
                            ],
                        },
                    ],
                };
                let data = await client.handle('createMenu', menu);
                reply = !data.errcode ? '自定义菜单创建成功~' : '21.公众号尚未通过微信认证，无法调用接口～';
            } catch (e) {
                console.log(e);
            }
        } else if ("22" === content) {
            try {
                let menu = {
                    button: [
                        {
                            name: 'Photo&Scan',
                            sub_button: [
                                {
                                    name: '系统拍照发图',
                                    type: 'pic_sysphoto',
                                    key: 'rselfmenu_1_0',
                                },
                                {
                                    name: '拍照或者相册发图',
                                    type: 'pic_photo_or_album',
                                    key: 'rselfmenu_1_1',
                                },
                                {
                                    name: '微信相册发图',
                                    type: 'pic_weixin',
                                    key: 'rselfmenu_1_2',
                                },
                                {
                                    name: '扫码推',
                                    type: 'scancode_push',
                                    key: 'rselfmenu_0_1',
                                },
                                {
                                    name: '扫码带提示',
                                    type: 'scancode_waitmsg',
                                    key: 'rselfmenu_0_0',
                                },
                            ],
                        },
                        {
                            name: 'Category',
                            type: 'view',
                            url: 'http://www.feihu1996.cn/',
                        },
                        {
                            name: `Other`,
                            sub_button: [
                                {
                                    name: '点击',
                                    type: 'click',
                                    key: "no_110",
                                },
                                {
                                    name: '地理位置',
                                    type: "location_select",
                                    key: 'no_111'
                                },
                            ],
                        },
                    ],
                };
                let rules = {
                    // tag_id:"2",
                    // sex:"1",
                    // country:"中国",
                    // province:"广东",
                    // city:"广州",
                    // client_platform_type:"2",
                    language: "en",
                };
                let data = await client.handle('createMenu', menu, rules);
                data = await client.handle('fetchMenu');
                reply = data.conditionalmenu ? '个性化菜单创建成功～' : '22.公众号尚未通过微信认证，无法调用接口～';
            } catch (e) {
                console.log(e);
            }
        } else if ("更新菜单" === content) {
            try {
                await client.handle('deleteMenu');
                let data = await client.handle('createMenu', commonMenu);
                reply = !data.errcode ? '自定义菜单创建成功~' : '更新菜单：公众号尚未通过微信认证，无法调用接口～';
            } catch (e) {
                console.log(e);
            }
        } else if ("首页" === content) {
            reply = [{
                title: "koaMovie",
                description: "匆匆岁月，有你最爱",
                picUrl: "http://imgsrc.baidu.com/forum/pic/item/72a2813eb13533faa72b7044a5d3fd1f40345bb1.jpg",
                url: Config.BASE_URL,
            }];
        } else if ("兰洁" === content) {
            reply = "兰洁，我喜欢你";
        } else {
            let movies = await Api.movie.searchMoviesByKeyword(content);
            if (!movies || 0 === movies.length) {
                movies = await Api.movie.findMoviesByCat(content);
            }
            if (!movies || 0 === movies.length) {
                movies = await Api.movie.searchDoubanMovies(content);
            }
            movies = movies.slice(0, 8);
            if (movies) {
                reply = [];
                movies.forEach((movie) => {
                    let poster = movie.poster;
                    if (poster.indexOf('http') === -1) {
                        poster = Config.BASE_URL + '/static/upload/' + poster;
                    }
                    article = {
                        title: movie.title,
                        description: movie.summary,
                        picUrl: poster,
                        url: Config.BASE_URL + '/movie/detail/' + movie._id,
                    };
                    reply.push(article);
                });
            } else {
                reply = `没有查询到与${content}相关的电影，换个关键词试试看~`;
            }
        }
        context.body = reply;
    }

    // if ('event' === Message.MsgType) {
    //     let reply = '接收事件推送～';
    //     if ("subscribe" === Message.Event) {
    //         reply = `欢迎订阅～${Message.EventKey ? '扫码关注，扫码参数：' + Message.EventKey + '，Ticket：,' + Message.Ticket : ''}`;
    //     }
    //     if ("SCAN" === Message.Event) {
    //         reply = `扫描带参数二维码，二维码scene_id：${Message.EventKey}，二维码的ticket：${Message.Ticket}`;
    //     }
    //     if ("unsubscribe" === Message.Event) {
    //         reply = `无情取消订阅～`;
    //     }
    //     if ("LOCATION" === Message.Event) {
    //         reply = `您上报的位置是：${Message.Latitude}-${Message.Longitude}-${Message.Precision}`;
    //     }
    //     if ("CLICK" === Message.Event) {
    //         reply = `你点击了菜单的${Message.EventKey}`;
    //         if ("help" == Message.EventKey) {
    //             reply = Help;
    //         }
    //         if ("movie_hot" == Message.EventKey) {
    //             let movies = await Api.movie.findHotMovies(-1, 3);
    //             reply = [];
    //             movies.forEach((movie) => {
    //                 let poster = movie.poster;
    //                 if (poster.indexOf('http') === -1) {
    //                     poster = Config.BASE_URL + '/static/upload/' + poster;
    //                 }
    //                 reply.push({
    //                     title: movie.title,
    //                     description: movie.summary,
    //                     picUrl: poster,
    //                     url: Config.BASE_URL + '/movie/detail/' + movie._id,
    //                 });
    //             });
    //         }
    //         if ("movie_cold" == Message.EventKey) {
    //             let movies = await Api.movie.findHotMovies(1, 3);
    //             reply = [];
    //             movies.forEach((movie) => {
    //                 let poster = movie.poster;
    //                 if (poster.indexOf('http') === -1) {
    //                     poster = Config.BASE_URL + '/static/upload/' + poster;
    //                 }
    //                 article = {
    //                     title: movie.title,
    //                     description: movie.summary,
    //                     picUrl: poster,
    //                     url: Config.BASE_URL + '/movie/detail/' + movie._id,
    //                 };
    //                 reply.push(article);
    //             });
    //         }
    //         if ("movie_comedy" == Message.EventKey) {
    //             let movies = await Api.movie.findMoviesByCat("喜剧");
    //             reply = [];
    //             movies.forEach((movie) => {
    //                 let poster = movie.poster;
    //                 if (poster.indexOf('http') === -1) {
    //                     poster = Config.BASE_URL + '/static/upload/' + poster;
    //                 }
    //                 article = {
    //                     title: movie.title,
    //                     description: movie.summary,
    //                     picUrl: poster,
    //                     url: Config.BASE_URL + '/movie/detail/' + movie._id,
    //                 };
    //                 reply.push(article);
    //             });
    //         }
    //         if ("movie_love" == Message.EventKey) {
    //             let movies = await Api.movie.findMoviesByCat("爱情");
    //             reply = [];
    //             movies.forEach((movie) => {
    //                 let poster = movie.poster;
    //                 if (poster.indexOf('http') === -1) {
    //                     poster = Config.BASE_URL + '/static/upload/' + poster;
    //                 }
    //                 article = {
    //                     title: movie.title,
    //                     description: movie.summary,
    //                     picUrl: poster,
    //                     url: Config.BASE_URL + '/movie/detail/' + movie._id,
    //                 };
    //                 reply.push(article);
    //             });
    //         }
    //         if ("movie_science_fiction" == Message.EventKey) {
    //             let movies = await Api.movie.findMoviesByCat("科幻");
    //             reply = [];
    //             movies.forEach((movie) => {
    //                 let poster = movie.poster;
    //                 if (poster.indexOf('http') === -1) {
    //                     poster = Config.BASE_URL + '/static/upload/' + poster;
    //                 }
    //                 article = {
    //                     title: movie.title,
    //                     description: movie.summary,
    //                     picUrl: poster,
    //                     url: Config.BASE_URL + '/movie/detail/' + movie._id,
    //                 };
    //                 reply.push(article);
    //             });
    //         }
    //         if ("movie_suspense" == Message.EventKey) {
    //             let movies = await Api.movie.findMoviesByCat("悬疑");
    //             reply = [];
    //             movies.forEach((movie) => {
    //                 let poster = movie.poster;
    //                 if (poster.indexOf('http') === -1) {
    //                     poster = Config.BASE_URL + '/static/upload/' + poster;
    //                 }
    //                 article = {
    //                     title: movie.title,
    //                     description: movie.summary,
    //                     picUrl: poster,
    //                     url: Config.BASE_URL + '/movie/detail/' + movie._id,
    //                 };
    //                 reply.push(article);
    //             });
    //         }
    //         if ("movie_animation" == Message.EventKey) {
    //             let movies = await Api.movie.findMoviesByCat("动画");
    //             reply = [];
    //             movies.forEach((movie) => {
    //                 let poster = movie.poster;
    //                 if (poster.indexOf('http') === -1) {
    //                     poster = Config.BASE_URL + '/static/upload/' + poster;
    //                 }
    //                 article = {
    //                     title: movie.title,
    //                     description: movie.summary,
    //                     picUrl: poster,
    //                     url: Config.BASE_URL + '/movie/detail/' + movie._id,
    //                 };
    //                 reply.push(article);
    //             });
    //         }
    //     }
    //     if ("VIEW" === Message.Event) {
    //         reply = `你点击了菜单链接： ${Message.EventKey} ${Message.MenuId}`;
    //     }
    //     if ("scancode_push" === Message.Event || "scancode_waitmsg" === Message.Event) {
    //         reply = `你扫码了：${Message.ScanCodeInfo.ScanType} ${Message.ScanCodeInfo.ScanResult}`;
    //     }
    //     if ("pic_sysphoto" === Message.Event) {
    //         reply = `系统拍照发图：${Message.SendPicsInfo.Count} ${JSON.stringify(Message.SendPicsInfo.PicList)}`;
    //     }
    //     if ("pic_photo_or_album" === Message.Event) {
    //         reply = `拍照或者相册发图：${Message.SendPicsInfo.Count} ${JSON.stringify(Message.SendPicsInfo.PicList)}`;
    //     }
    //     if ("pic_weixin" === Message.Event) {
    //         reply = `微信相册发图：${Message.SendPicsInfo.count} ${JSON.stringify(Message.SendPicsInfo.PicList)}`;
    //     }
    //     if ("location_select" === Message.Event) {
    //         reply = `地理位置：${JSON.stringify(Message.SendLocationInfo)}`;
    //     }
    //     context.body = reply;
    // }

    // if ('image' === Message.MsgType) {
    //     reply = `接收图片消息：${Message.PicUrl ? Message.PicUrl : ''}`;
    //     context.body = reply;
    // }

    // if ('voice' === Message.MsgType) {
    //     reply = `接收语音消息~`;
    //     let voiceText = Message.Recognition;
    //     let movies = await Api.movie.searchMoviesByKeyword(voiceText);
    //     if (!movies || 0 === movies.length) {
    //         movies = await Api.movie.findMoviesByCat(voiceText);
    //     }
    //     if (!movies || 0 === movies.length) {
    //         movies = await Api.movie.searchDoubanMovies(voiceText);
    //     }
    //     movies = movies.slice(0, 8);
    //     if (movies) {
    //         reply = [];
    //         movies.forEach((movie) => {
    //             let poster = movie.poster;
    //             if (poster.indexOf('http') === -1) {
    //                 poster = Config.BASE_URL + '/static/upload/' + poster;
    //             }
    //             article = {
    //                 title: movie.title,
    //                 description: movie.summary,
    //                 picUrl: poster,
    //                 url: Config.BASE_URL + '/movie/detail/' + movie._id,
    //             };
    //             reply.push(article);
    //         });
    //     } else {
    //         reply = `没有查询到与${voiceText}相关的电影，换个关键词试试看~`;
    //     }
    //     context.body = reply;
    // }

    await next();
};