const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const PlayerModel = require('../../../util/Mongoose/models/Player')
const Skills = require('../../../util/Modules/Game/Attacks.json')
const path = require('path')
const pagination = require('../../../util/pagination')
module.exports = {
    customId: path.basename(__filename, '.js'),
    async execute(interaction) {
        let Player = interaction.user
        let { PlayerInventoryMoves } = await PlayerModel.findOne({ ServerID: interaction.guild.id, UserID: Player.id })
        if (PlayerInventoryMoves.length == 0) {
            let TheEmbed = await client.UtilFunctions.createTempEmbed(Player.username, Player.displayAvatarURL(), 'Red', 'You have no moves saved.')
            return interaction.reply({ embeds: [TheEmbed] })
        }
        let Elements = []
        for ([key, value] of Object.entries(Skills)) {
            for (Skill of Skills[key].ListOfAttacks) {
                let Playeritem = Skill
                Elements.push({
                    name: Playeritem.Name,
                    value: `ID: ${Playeritem.ItemID}\nDescription:${Playeritem.Description}`
                })
            }
        }
        await pagination('All of Players current movesets.', interaction, Elements, 1, 5)
    }
}