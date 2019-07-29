const Mongoose = require('mongoose');
const { resolve } = require('path');
const glob = require('glob');

exports.InitSchemas = () => {
    glob.sync(resolve(__dirname, './schema', '**/*.js')).forEach(require);
};

Mongoose.Promise = global.Promise;

exports.connect = (db) => {
    return new Promise((resolve) => {
        Mongoose.connect(db, {useNewUrlParser: true})
        Mongoose.connection.on('disconnect', () => {
            console.log('数据库挂了')
        })
        Mongoose.connection.on('error', () => {
            console.log(err)
        })
        Mongoose.connection.on('open', () => {
            resolve()
            console.log('connected55555')
        })
    })
}