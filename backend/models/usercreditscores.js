const mongoose = require('mongoose')
require('dotenv').config()

const mongoURI = process.env.MONGODB_URI.replace("<db_name>", "usercreditscoresdb")
const usercreditscoresdb = mongoose.createConnection(mongoURI)

let usercreditscoreSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    creditscore: {
        type: Number,
        required: true
    },
    income_lvl: {
        type: Number,
        required: true
    },
    age_lvl: {
        type: Number,
        required: true
    },
    dep_lvl: {
        type: Number,
        required: true
    },
    debts_lvl: {
        type: Number,
        required: true
    },
    education_lvl: {
        type: Number,
        required: true
    },
    assets_lvl: {
        type: Number,
        required: true
    },
    city_lvl: {
        type: Number,
        required: true
    },
    installments_lvl: {
        type: Number,
        required: true
    },
    late_lvl: {
        type: Number,
        required: true
    }
})

let UserCreditScore = usercreditscoresdb.model("UserCreditScore", usercreditscoreSchema)

module.exports = UserCreditScore