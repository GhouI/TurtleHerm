const Mongoose = require('mongoose')

const ServerSchema = new Mongoose.Schema({
    __id: Mongoose.Schema.Types.ObjectId,
    ServerID: {
        type: String,
        required: true,
    },
    RegisteredChannel: {
        type: String,
        required: true
    },
    GuildName: {
        type: String,
        required: true,
    },
    ServerGameSettings: {
        type: Object,
        required: true
    }, //Planet and Arc settings stored in here
    MobsCount: {
        type: Object,
        required: true
    },
    Mob: {
        type: Object,
        required: false,
    },
    Activated: {
        type: Boolean,
        required: true
    },
}, {
    collection: "GuildInfos",
})



module.exports = Mongoose.model("Server", ServerSchema)