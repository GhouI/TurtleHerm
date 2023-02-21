const shop = require('../util/Modules/Game/Items/ItemsList.json')
const { SlashCommandBuilder } = require('discord.js')
const EmbedPages = require('../util/embedpages')
module.exports = {
    data: new SlashCommandBuilder().setName("shop").setDescription("Purchase a skill from the item shop.").addStringOption(cmd => cmd.setName("purchase").setDescription("Purchase an item with their name or alias.")),
    restricted: false,
    async execute(interaction) {
        if (interaction.options.getString('purchase') == null) {
            let ArrayOfElements = []
            for ([key, value] of Object.entries(shop)) {
                for (Item of shop[key]) {
                    ArrayOfElements.push({
                        name: Item.Name.toString(),
                        value: Item.Description.toString()
                    })
                }
            }
            const EmbedPage = await new EmbedPages().init(interaction, ArrayOfElements)
        }
    }
}