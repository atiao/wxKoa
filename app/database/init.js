const Mongoose = require('mongoose');
const { resolve } = require('path');
const glob = require('glob');

exports.InitSchemas = () => {
    glob.sync(resolve(__dirname, './schema', '**/*.js')).forEach(require);
};

Mongoose.Promise = global.Promise;

exports.connect = (db) => {
    let maxConnectTimes = 0;
    return new Promise((resolve) => {
        if (process.env.NODE_ENV !== 'production') {
            Mongoose.set('debug', true);
        }
        Mongoose.connect(db, {useNewUrlParser: true})
        Mongoose.connection.on('disconnect', () => {
            maxConnectTimes++;
            if (maxConnectTimes < 5) {
                Mongoose.connect(db, { useNewUrlParser: true });
            } else {
                throw new Error("数据库挂了~");
            }
        })
        Mongoose.connection.on('error', (err) => {
            maxConnectTimes++;
            if (maxConnectTimes < 5) {
                Mongoose.connect(db, { useNewUrlParser: true });
            } else {
                throw new Error(err);
            }
        })
        Mongoose.connection.on('open', () => {
            resolve()
            console.log('connected55555')
        })
    })
}