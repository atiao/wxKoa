var qs = require('qs')
var fs = require('fs')
const getAccessToken = function () {
    let queryParams = {
        'grant_type': 'client_credential',
        'appid': 'wxd01c78b523f3e6f1',
        'secret': '17a4be58b6038c93918331a3a3d46e3a'
    };

    let wxGetAccessTokenBaseUrl = 'https://api.weixin.qq.com/cgi-bin/token?' + qs.stringify(queryParams);
    let options = {
        method: 'GET',
        url: wxGetAccessTokenBaseUrl
    };
    return new Promise((resolve, reject) => {
        request(options, function (err, res, body) {
            if (res) {
                resolve(JSON.parse(body));
            } else {
                reject(err);
            }
        });
    })
};

const saveToken = function () {
    getAccessToken().then(res => {
        let token = res['access_token'];
        fs.writeFile('./token', token, function (err) {

        });
    })
};

const refreshToken = function () {
    saveToken();
    setInterval(function () {
        saveToken();
    }, 7000 * 1000);
};