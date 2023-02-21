const { SlashCommandBuilder } = require("discord.js");
const PlayerScheme = require('../util/Mongoose/models/Player.js')
module.exports = {
    data: new SlashCommandBuilder().setName("start").setDescription("Allows you to create an account with the bot."),
    restricted: true,
    async execute(interaction) {
        let playerData = await PlayerScheme.findOne({ ServerID: interaction.guild.id, UserID: interaction.member.id })
        if (playerData) {
            return interaction.reply("Sorry but you already have an account with this server.")
        }
        const newPlayer = new PlayerScheme({
            ServerID: interaction.guild.id,
            UserID: interaction.member.id,
            Level: 1,
            Exp: 0,
            MaxExp: 5000,
            Zeni: 1000,
            PlayerInventory: [],
            PlayerHealth: {
                "Health": 1000,
                "MaxHealth": 1000,
                "Stamina": 1000,
                "MaxStamina": 1000,
                "Ki": 100,
                "MaxKi": 100,
            },
            PlayerStats: {
                "Strength": 0,
                "Speed": 0,
                "Defense": 0,
                "Ki Control": 0,
                "RP": 5,
            },
            PlayerMoveSet: {
                "S1": "None",
                "S2": "None",
                "S3": "None",
                "S4": "None",
            },
            PlayerArmor: {
                "Head": "None",
                "Top": "None",
                "Bottom": "None"
            }
        }).save().then(() => interaction.reply("Your account has been created."))
    }
}