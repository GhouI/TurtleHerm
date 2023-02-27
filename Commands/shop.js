const shop = require('../util/Modules/Game/Items/ItemsList.json')
const pagination = require('../util/pagination')
const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js')
module.exports = {
    data: new SlashCommandBuilder().setName("shop").setDescription("Purchase a skill from the item shop.").addStringOption(cmd => cmd.setName("purchase").setDescription("Purchase an item with their name or alias.")),
    restricted: false,
    async execute(interaction) {

        let ArrayOfElements = []
        for ([key, value] of Object.entries(shop)) {
            for (Item of shop[key]) {
                ArrayOfElements.push({
                    name: Item.Name.toString(),
                    value: `Description: ${Item.Description.toString()}\nItem ID:${Item.ItemId.toString()}`
                })
            }
        }
        await pagination('Shop', interaction, ArrayOfElements, 1, 5)


    }
}