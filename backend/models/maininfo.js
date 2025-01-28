const mongoose = require('mongoose')
require('dotenv').config()

const mongoURI = process.env.MONGODB_URI.replace("<db_name>", "maininfodb")
const maininfodb = mongoose.createConnection(mongoURI)

let mainSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    income: {
        type: Number,
        required: true
    },
    qualification: {
        type: String,
        required: true 
    },
    aadhaar: {
        type: String,
        required: true
    },
    dependents: {
        type: Number,
        required: true
    },
    loan: {
        type: String,
        required: true
    },
    insurance: {
        type: String,
        required: true
    },
    assets: {
        type: Number,
        required: true
    },
    debt: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: true
    }
    
})

let MainInfo = maininfodb.model("MainInfo", mainSchema)

module.exports = MainInfo;