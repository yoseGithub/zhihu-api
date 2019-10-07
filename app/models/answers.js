const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const AnswerSchema = new Schema({
    __v: { type: Number, select: false },
    content: { type: String, required: true },
    answerer: { type: Schema.Types.ObjectId, ref: 'User', required: true, select: false },
    questionId: { type: String, select: true },
    voteCount: { type: Number, required: true, default: 0 }
});

module.exports = model('Answer', AnswerSchema);