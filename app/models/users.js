const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const userSchema = new Schema({
    __v: { type: Number, select: false },
    name: { type: String, required: true },
    password: { type: String, required: true, select: false },
    avatar_url: { type: String }, // 用户头像
    gender: { type: String, enum: ['male', 'female'], default: 'male', required: true }, // enum 可枚举，性别
    headline: { type: String }, // 一句话简介
    locations: { type: [{ type: String }], select: false }, // 可枚举的字符串数组，居住地
    business: { type: String, select: false }, // 公司
    employments: {  // 职业经历
        type: [{
            company: { type: String },
            job: { type: String }
        }],
        select: false
    },
    educations: { // 教育经历
        type: [{
            school: { type: String },
            major: { type: String },
            diploma: { type: Number, enum: [1, 2, 3, 4, 5] }, // 文凭：初中，高中，大专，本科，本科以上
            entrance_year: { type: Number },
            graduation_year: { type: Number }
        }],
        select: false
    },
    following: { // 关注者
        type: [{
            type: Schema.Types.ObjectId, // 用户ID
            ref: 'User' // 引用 User = require('../models/users') 数据库模型
        }],
        select: false
    }
});

// user代表集合，导出的是一个类
module.exports = model('User', userSchema);