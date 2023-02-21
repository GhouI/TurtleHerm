const Mongoose = require('mongoose')

const Player = new Mongoose.Schema({
    __id: Mongoose.Schema.Types.ObjectId,
    ServerID: { type: String, required: true }, //Guild ID
    UserID: { type: String, required: true }, // Author ID 
    Level: { type: String, required: true }, // Player Level
    Exp: { type: Number, required: true }, // Player Exp
    MaxExp: { type: Number, required: true }, // Player Max Exp
    Zeni: { type: Number, required: true }, //Player Gold
    PlayerInventory: { type: Array, required: true }, //It has player inventory
    PlayerHealth: { type: Object, required: true }, //Includes Player Health, Player Max Health, Player Stamina, Player Max Stamina, Player Ki, Player Max Ki
    PlayerStats: { type: Object, required: true }, //Includes Remaining Points, Strength, Speed, Defense, Ki Control
    PlayerMoveSet: { type: Object, required: true }, //The 4 Moveset for the Player
    PlayerInventoryMoves: { type: Array, required: false },
    PlayerArmor: { type: Object, required: true } //Armor Set
}, { collection: 'PlayerData' })


module.exports = Mongoose.model("Player", Player)