const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const PlayerModel = require('../../../util/Mongoose/models/Player')

const path = require('path')
module.exports = {
    customId: path.basename(__filename, '.js'),
    async execute(interaction) {
        let Player = interaction.user
        let { PlayerMoveSet } = await PlayerModel.findOne({ ServerID: interaction.guild.id, UserID: interaction.user.id })

        function AddBlankFields(TheObject) {
            let newArray = []
            let counter = 0;
            for (Key in TheObject) {
                if (typeof TheObject[Key] == "object") {
                    newArray.push({ name: TheObject[Key].Name.toString(), value: TheObject[Key].Description.toString(), inline: true })
                    counter++;
                    if (counter % 2 == 0) {
                        newArray.push({ name: "\u200B", value: "\u200B", inline: true })
                    }
                }
            }
            return newArray
        }
        let TheEmbed = new EmbedBuilder();
        TheEmbed.setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setFooter({
                text: "To change your attacks list. Do /attack change command"
            })
        TheEmbed.setDescription("Here is a list of all your attacks.")
        TheEmbed.setColor('Random')
        TheEmbed.addFields(...AddBlankFields(PlayerMoveSet))
        return interaction.reply({ embeds: [TheEmbed] })
    }
}

/*
const { EmbedBuilder } = require('discord.js')
const PlayerModel = require('../../../util/Mongoose/models/Player')
module.exports = {
    customId: path.basename(__filename, '.js'),
    async execute(interaction) {

    }
}
}*/