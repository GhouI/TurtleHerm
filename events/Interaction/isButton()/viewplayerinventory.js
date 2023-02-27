const PlayerModel = require('../../../util/Mongoose/models/Player')
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

module.exports = {
    customId: "viewplayerinventory",
    async execute(interaction) {
        const client = interaction.client;
        const { createTempEmbed } = client.UtilFunctions
        let Player = interaction.user
        let { PlayerInventory } = await PlayerModel.findOne({ ServerID: interaction.guild.id, UserID: interaction.user.id })
        if (PlayerInventory.length == 0) {
            let TheEmbed = await client.UtilFunctions.createTempEmbed(Player.username, Player.displayAvatarURL(), 'Red', "You have no items in your inventory.")
            return interaction.reply({ embeds: [TheEmbed] })
        }
    }
}