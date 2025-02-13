var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const personSchema = new Schema({  // 스키마 객체 생성
    name: String,
    age: Number,
    email: { type: String, required: true },
});

module.exports = mongoose.model('Person', personSchema);  // 모듈 생성