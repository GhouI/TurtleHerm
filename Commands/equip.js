const { SlashCommandBuilder, EmbedBuilder, inlineCode } = require("discord.js");
const ItemModule = require('../util/Modules/Game/Items/Items.js');
const PlayerModel = require("../util/Mongoose/models/Player");


module.exports = {
    data: new SlashCommandBuilder().setName("equip").setDescription("Equip Items").addStringOption(str => str.setName('item').setDescription('Input the item name or ID to equip').setRequired(true)),
    restricted: true,
    async execute(interaction) {
        let User = await PlayerModel.findOne({
            ServerID: interaction.guildId,
            UserID: interaction.user.id
        })
        if (User == null) return interaction.reply("Could not find the user.")
        let option = interaction.options.getString('item')
        let getItem = await new ItemModule(option).Item
        if (getItem == 'Disabled') {
            return interaction.reply("I could not find the item")
        } else {
            return interaction.reply(getItem.use(User))
        }
    }
}