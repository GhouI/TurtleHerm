const { SlashCommandBuilder, EmbedBuilder, inlineCode } = require("discord.js");


module.exports = {
    data: new SlashCommandBuilder().setName("help").setDescription("Returns with the list of commands.").addStringOption(cmd => cmd.setName("commandname").setDescription("get the help command")),
    restricted: false,
    async execute(interaction) {
        const { commands } = interaction.client
        let helps = ""
        let helpsarray = []
        helpsarray.push(commands.map(command => (command.data.name)))
        if (interaction.options.getString('commandname') == null) {
            helps = inlineCode(commands.map(command => (command.data.name)).join(','))

            return interaction.reply({ embeds: [new EmbedBuilder().setTitle("List of commands").setDescription((helps))] })
        } else if (commands.has(interaction.options.getString('commandname'))) {
            let command = commands.get(interaction.options.getString('commandname'))
            console.log(command.data.name)
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setAuthor({
                        name: interaction.user.username,
                        iconURL: interaction.user.avatarURL()

                    })
                    .setTitle(command.data.name)
                    .setDescription(command.data.description)
                ]
            })
        } else {
            return interaction.reply("Command you inputted does not exist.")
        }

    }
}