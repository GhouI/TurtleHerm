const mongoose = require('mongoose')

const DailyScheme = new mongoose.Schema({
    ServerID: { type: String, required: true },
    UserID: { type: String, required: true }
}, {
    timestamps: true,
    collection: "ServerDailies"
})


module.exports = mongoose.model("Daily", DailyScheme)