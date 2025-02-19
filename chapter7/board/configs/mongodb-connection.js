require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });

const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI_BOARD;

module.exports = function (callback) {   // 몽고디비 커넥션 연결 함수 반환 
    return MongoClient.connect(uri, callback);
}