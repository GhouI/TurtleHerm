const { SlashCommandBuilder, ChannelType } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("setup").setDescription("Setup the bot").addChannelOption(chan => chan.setName("channel").setDescription("Set the channel where the bot will be activated in.").setRequired(true).addChannelTypes(ChannelType.GuildText)),
    restricted: false,
    async execute(interaction) {
        await interaction.client.UtilFunctions.connectMD()
        let ServerScheme = require('../util/Mongoose/models/Server')
        let Server = await ServerScheme.findOne({ ServerID: interaction.guild.id })
        if (!Server) {
            await interaction.client.UtilFunctions.createServerDataFile(interaction.guild)
            return interaction.reply("It seems there is no data file for this server. Going to create one now.")
        }
        if (Server.RegisteredChannel != "None") {
            return interaction.reply("There is already a channel setup. If you want to restart. Please run the restart command.  ")
        }
        if (Server.RegisteredChannel == "None") {
            let filter = { ServerID: interaction.guild.id }
            let newData = { $set: { RegisteredChannel: interaction.options.getChannel("channel").id } }
            await ServerScheme.updateOne(filter, newData)
            return interaction.reply("Done.")
        }
    }
}