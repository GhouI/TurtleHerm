const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const PlayerModel = require('../util/Mongoose/models/Player')
module.exports = {
    data: new SlashCommandBuilder()
        .setName("appoint")
        .setDescription("Appoints a stats point to a certain stat.")
        .addStringOption(cmd => cmd
            .setName("statname")
            .setDescription("The stat you would like to add to.")
            .setRequired(true))
        .addIntegerOption(numoption => numoption
            .setName('quantity')
            .setDescription("Indicate amount to add/remove. Use ' - ' to remove. Keep value positive to increase stat point.")
            .setRequired(true)
        ),
    restricted: true,
    async execute(interaction) {
        let allowedStatsNames = {
            "Strength": ["Strength".toLowerCase(), "Strength".toUpperCase(), "Str", "Str".toLowerCase(), "Str".toUpperCase()],
            "Speed": ["Speed".toUpperCase(), "Speed".toLowerCase(), "Sped", "Sped".toUpperCase(), "Sped".toUpperCase(), "Sp"],
            "Defense": ["Defenses".toUpperCase(), "Def", "Defense", "Defense".toLowerCase(), "Defenses".toLowerCase()],
            "Ki Control": ["Ki", "Ki Control", "Control", "Ki-Control", "Ki".toLowerCase(), "Ki Control".toUpperCase(), "Ki-Control".toUpperCase()]
        }
        let getStatName = interaction.options.getString('statname').toLowerCase()
        let getStatNumber = interaction.options.getInteger('quantity')
        let ChosenStat = null;
        for (const [key, value] of Object.entries(allowedStatsNames)) {
            if (value.includes(getStatName)) {
                ChosenStat = key;
                break;
            }
        }
        let EmbedsArray = []
        if (ChosenStat == null) {
            EmbedsArray.push(new EmbedBuilder()
                .setTitle('Invalid')
                .setDescription('The inputted stat name is invalid. Try again')
                .setColor('Red')
                .setAuthor({
                    name: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL()
                }))
        }
        let { PlayerStats } = await PlayerModel.findOne({ ServerID: interaction.guild.id, UserID: interaction.user.id })
        let { RP } = PlayerStats
        //Number.isSafeInteger(getStatNumber) == false ||
        if (getStatNumber == 0 || getStatNumber == null) {
            if (EmbedsArray[0] != null) {
                EmbedsArray[0].setDescription('The Inputted Stat Name and Quantity is invalid')
            }
            EmbedsArray.push(new EmbedBuilder()
                .setTitle('Invalid')
                .setDescription('The inputted quantity is invalid')
                .setColor('Red')
                .setAuthor({
                    name: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL()
                }))
        }
        if (EmbedsArray[0] != null) {
            return interaction.reply({
                embeds: EmbedsArray,
                ephemeral: true
            })
        }
        if (getStatNumber < 0) {
            if (PlayerStats[ChosenStat] == 0) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setAuthor({
                            name: interaction.user.username,
                            iconURL: interaction.user.displayAvatarURL()
                        })
                        .setTitle('Invalid')
                        .setDescription(`${ChosenStat} has 0 Points to remove from.`)
                        .setColor('Red')
                    ],
                    ephemeral: true
                })
            }
            PlayerStats[ChosenStat] -= Math.abs(getStatNumber)
            PlayerStats.RP += Math.abs(getStatNumber)

            await PlayerModel.updateOne({ ServerID: interaction.guild.id, UserID: interaction.user.id }, {
                $set: {
                    PlayerStats: PlayerStats
                }
            })
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setAuthor({
                        name: interaction.user.username,
                        iconURL: interaction.user.displayAvatarURL()
                    })
                    .setTitle(`Player Stats have been updated.`)
                    .setDescription(`${ChosenStat} has been updated to ${PlayerStats[ChosenStat]}.`)
                    .setColor('Green')
                ],
                ephemeral: true
            })
        } else {
            PlayerStats.RP = Math.max(0, RP - getStatNumber)
            PlayerStats[ChosenStat] += getStatNumber
            await PlayerModel.updateOne({ ServerID: interaction.guild.id, UserID: interaction.user.id }, {
                $set: {
                    PlayerStats: PlayerStats
                }
            })
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setAuthor({
                        name: interaction.user.username,
                        iconURL: interaction.user.displayAvatarURL()
                    })
                    .setTitle(`Player Stats have been updated.`)
                    .setDescription(`${ChosenStat} has been updated to ${PlayerStats[ChosenStat]}.`)
                    .setColor('Green')
                ],
                ephemeral: true
            })
        }
    }
}