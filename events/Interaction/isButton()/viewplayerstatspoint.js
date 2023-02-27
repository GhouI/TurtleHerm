const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const PlayerModel = require('../../../util/Mongoose/models/Player')
module.exports = {
    customId: "viewplayerstatspoint",
    async execute(interaction) {
        let Player = interaction.user
        let { PlayerStats } = await PlayerModel.findOne({ ServerID: interaction.guild.id, UserID: interaction.user.id })
        let { Strength, Speed, Defense, "Ki Control": KiControl, RP } = PlayerStats
        const TheEmbed = new EmbedBuilder()
            .setAuthor({
                name: Player.username + "'s stats points",
                iconURL: Player.displayAvatarURL()
            })
            .setColor('Random')
            .setTitle(`Stat's points`)
            .addFields({
                name: "Strength",
                value: Strength.toString(),
                inline: true
            }, {
                name: "Speed",
                value: Speed.toString(),
                inline: true,
            }, {
                name: "Defense",
                value: Defense.toString(),
                inline: true,
            }, {
                name: "Ki Control",
                value: KiControl.toString(),
                inline: true,
            }, {
                name: "Avaliable Points",
                value: RP.toString(),
                inline: true,
            })
        return interaction.reply({ embeds: [TheEmbed] })
    }
}