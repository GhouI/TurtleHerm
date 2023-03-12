const PlayerModel = require('../../../util/Mongoose/models/Player')
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const pagination = require('../../../util/pagination')
const path = require('path')

module.exports = {
    customId: path.basename(__filename, '.js'),
    async execute(interaction) {
        const client = interaction.client;
        let Player = interaction.user
        let { PlayerInventory } = await PlayerModel.findOne({ ServerID: interaction.guild.id, UserID: interaction.user.id })
        if (PlayerInventory.length == 0) {
            let TheEmbed = await client.UtilFunctions.createTempEmbed(Player.username, Player.displayAvatarURL(), 'Red', "You have no items in your inventory.")
            return interaction.reply({ embeds: [TheEmbed] })
        }
        let Elements = []
        for (let item in PlayerInventory) {
            let Playeritem = PlayerInventory[item]
            Elements.push({
                name: Playeritem.Name,
                value: `ID: ${Playeritem.ItemId}\nQuantity:${Playeritem.Quantity}`
            })
        }
        await pagination('Player Inventory', interaction, Elements, 1, 5)
    }
}