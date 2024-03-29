const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction } = require("discord.js");
const PlayerModel = require('../util/Mongoose/models/Player')

module.exports = {
    data: new SlashCommandBuilder().setName("stats").setDescription("Views your stats").addStringOption(cmd => cmd.setName("statstype").setDescription("which stats type are you looking for")),
    restricted: true,
    accountRestricted: true,
    async execute(interaction) {
        let { Level, Exp, MaxExp, PlayerInventory, PlayerHealth, PlayerStats, PlayerMoveSet, PlayerInventoryMoves } = await PlayerModel.findOne({
            ServerID: interaction.guildId,
            UserID: interaction.user.id
        })

        if (interaction.options.getString('statsType') == null) {
            let PlayerInventoryButton = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('viewplayerinventory').setLabel('Inventory').setStyle(ButtonStyle.Secondary))
            let PlayerStatsPointButton = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('viewplayerstatspoint').setLabel('Stats Points').setStyle(ButtonStyle.Secondary))
            let PlayerMoveSetButton = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('viewplayermoveset').setLabel('Your Selected Movesets').setStyle(ButtonStyle.Secondary))
            let PlayerInventoryMovesButton = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('viewplayersallmoveset').setLabel('View all your moves.').setStyle(ButtonStyle.Secondary))
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                    .setTitle(`${interaction.user.username} Account`)
                    .setDescription(`Basic Stat Information for ${interaction.user.username}`)
                    .setColor('Random')
                    .addFields({ name: "Health", value: PlayerHealth.Health.toString(), inline: true }, {
                        name: "\u200B",
                        value: "\u200B",
                        inline: true,
                    }, {
                        name: "Max Health",
                        value: PlayerHealth.MaxHealth.toString(),
                        inline: true,
                    }, {
                        name: "Stamina",
                        value: PlayerHealth.Stamina.toString(),
                        inline: true
                    }, {
                        name: "\u200B",
                        value: "\u200B",
                        inline: true,
                    }, {
                        name: "Max Stamina",
                        value: PlayerHealth.MaxStamina.toString(),
                        inline: true
                    }, {
                        name: "Ki",
                        value: PlayerHealth.Ki.toString(),
                        inline: true,
                    }, {
                        name: "\u200B",
                        value: "\u200B",
                        inline: true,
                    }, {
                        name: "Max Ki",
                        value: PlayerHealth.MaxKi.toString(),
                        inline: true,
                    })
                ],
                components: [PlayerInventoryButton, PlayerStatsPointButton, PlayerMoveSetButton, PlayerInventoryMovesButton]
            })
        }
    }
}