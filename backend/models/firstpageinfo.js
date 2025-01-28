const mongoose = require('mongoose')
require('dotenv').config()

const mongoURI = process.env.MONGODB_URI.replace("<db_name>", "firstpageinfodb")
const firstpageinfodb = mongoose.createConnection(mongoURI)

let firstSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobNo: {
        type: Number,
        required: true
    }
})

let FirstPageInfo = firstpageinfodb.model("FirstPageInfo", firstSchema)

module.exports = FirstPageInfo