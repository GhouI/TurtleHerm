const { SlashCommandBuilder } = require("discord.js");

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
    restricted: false,
    async execute(interaction) {
        let allowedStatsNames = {
            "Strength": ["Strength".toLowerCase(), "Strength".toUpperCase(), "Str", "Str".toLowerCase(), "Str".toUpperCase()],
            "Speed": ["Speed".toUpperCase(), "Speed".toLowerCase(), "Sped", "Sped".toUpperCase(), "Sped".toUpperCase(), "Sp"],
            "Defenses": ["Defenses".toUpperCase()],
            "Ki Control": []
        }
    }
}