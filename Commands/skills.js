const { SlashCommandBuilder, EmbedBuilder, inlineCode } = require("discord.js");
const PlayerModel = require('../util/Mongoose/models/Player')
const Attacks = require('../util/Modules/Game/Attacks.json')
module.exports = {
    data: new SlashCommandBuilder().setName("skill").setDescription("gives you a skill"),
    restricted: false,
    async execute(interaction) {
        let { PlayerMoveSet } = await PlayerModel.findOne({ ServerID: interaction.guild.id, UserID: interaction.user.id })
        let Data = PlayerMoveSet
        Data['S1'] = Attacks.Physical.ListOfAttacks[0]
        await PlayerModel.updateOne({ ServerID: interaction.guild.id, UserID: interaction.user.id }, { $set: { PlayerMoveSet: Data } })
        return interaction.reply("Updated your attacks")
    }
}