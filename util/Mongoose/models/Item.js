const Mongoose = require('mongoose')
const settingStr = { type: Object, required: true }
const settingInt = { type: Number, required: true }
const Item = new Mongoose.Schema({
    __id: Mongoose.Schema.Types.ObjectId,
    ServerID: settingStr,
    UserID: settingStr,
    ItemID: settingStr,
    ItemName: settingStr,
    ItemDescription: settingStr,
    ItemPrice: settingInt,
    ItemQuantity: settingInt,
    ItemType: settingStr,
    ItemURL: settingStr,
    ItemSettings: { type: Object, required: true }
}, { collection: 'Shop', timestamps: true })

module.exports = Mongoose.model("newItem", Item)