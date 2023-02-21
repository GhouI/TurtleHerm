const { SlashCommandBuilder, EmbedBuilder, inlineCode } = require("discord.js");
const ItemModule = require('../util/Modules/Game/Items/Items.js');
const PlayerModel = require("../util/Mongoose/models/Player");


module.exports = {
    data: new SlashCommandBuilder().setName("use").setDescription("use Items"),
    restricted: false,
    async execute(interaction) {
        const { commands } = interaction.client
        let User = await PlayerModel.findOne({
            ServerID: interaction.guildId,
            UserID: interaction.user.id
        })
        if (User == null) return interaction.reply("Could not find the user.")
        const Item = await new ItemModule(18).use(User)

        interaction.reply(Item)
    }
}