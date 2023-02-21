const { EmbedBuilder } = require('discord.js')
const PlayerModel = require('../../../util/Mongoose/models/Player')
const path = require('path')
module.exports = {
    customId: path.basename(__filename, '.js'),
    async execute(interaction) {
        let Player = interaction.user
        let { PlayerInventoryMoves } = await PlayerModel.findOne({ ServerID: interaction.guild.id, UserID: Player.id })
        if (PlayerInventoryMoves.length == 0) {
            let TheEmbed = await client.UtilFunctions.createTempEmbed(Player.username, Player.displayAvatarURL(), 'Red', 'You have no moves saved.')
            return interaction.reply({ embeds: [TheEmbed] })


        }
    }
}