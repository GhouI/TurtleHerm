const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction } = require("discord.js");
const PlayerModel = require('../util/Mongoose/models/Player')

module.exports = {
    data: new SlashCommandBuilder().setName("stats").setDescription("Views your stats").addStringOption(cmd => cmd.setName("statstype").setDescription('The stats name you want to view')),
    restricted: true,
    accountRestricted: true,
    async execute(interaction) {
        let { Level, Exp, MaxExp, PlayerInventory, PlayerHealth, PlayerStats, PlayerMoveSet, PlayerInventoryMoves } = await PlayerModel.findOne({
            ServerID: interaction.guildId,
            UserID: interaction.user.id
        })

        if (interaction.options.getString('statstype') == null) {
            let PlayerInventoryButton = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('viewplayerinventory').setLabel('Inventory').setStyle(ButtonStyle.Secondary))
            let PlayerStatsPointButton = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('viewplayerstatspoint').setLabel('Stats Points').setStyle(ButtonStyle.Secondary))
            let PlayerMoveSetButton = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('viewplayermoveset').setLabel('Selected Movesets').setStyle(ButtonStyle.Secondary))
            let PlayerInventoryMovesButton = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('viewplayersallmoveset').setLabel('All of your movesets.').setStyle(ButtonStyle.Secondary))
            let CurrentArmorEquippedButton = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('viewcurrentplayerarmor').setLabel('Current equipped armor.').setStyle(ButtonStyle.Secondary))

            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                    .setTitle(`${interaction.user.username} Account`)
                    .setDescription(`Basic Stat Information for ${interaction.user.username}`)
                    .setColor('Random')
                    .addFields({ name: "Health", value: PlayerHealth.Health.toString(), inline: true }, {
                        name: "Max Health",
                        value: PlayerHealth.MaxHealth.toString(),
                        inline: true,
                    }, {
                        name: "Level",
                        value: Level.toString(),
                        inline: true,
                    }, {
                        name: "Exp",
                        value: Exp.toString(),
                        inline: true,
                    }, {
                        name: "Max Exp",
                        value: MaxExp.toString(),
                        inline: true,
                    }, {
                        name: "Stamina",
                        value: PlayerHealth.Stamina.toString(),
                        inline: true
                    }, {
                        name: "Max Stamina",
                        value: PlayerHealth.MaxStamina.toString(),
                        inline: true
                    }, {
                        name: "Ki",
                        value: PlayerHealth.Ki.toString(),
                        inline: true,
                    }, {
                        name: "Max Ki",
                        value: PlayerHealth.MaxKi.toString(),
                        inline: true,
                    })
                ],
                components: [PlayerInventoryButton, PlayerStatsPointButton, PlayerMoveSetButton, PlayerInventoryMovesButton, CurrentArmorEquippedButton]
            })
        } else if (interaction.options.getString('statstype').toLowerCase() == 'inventory') {
            const Filez = require('../events/Interaction/isButton()/viewplayerinventory.js')
            Filez.execute(interaction)
        } else if (interaction.options.getString('statstype').trim().toLowerCase() == 'statspoints') {
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

        } else if (interaction.options.getString('statstype').trim().toLowerCase() == 'currentmoveset') {
            const Filez = require('../events/Interaction/isButton()/viewplayermoveset')
            Filez.execute(interaction)
        } else if (interaction.options.getString('statstype').trim().toLowerCase() == 'allmovesets') {
            const Filez = require('../events/Interaction/isButton()/viewplayersallmoveset')
            Filez.execute(interaction)
        } else if (interaction.options.getString('statstype').trim().toLowerCase() == 'currentarmor') {
            const Filez = require('../events/Interaction/isButton()/viewcurrentplayerarmor')
            Filez.execute(interaction)
        }
    }
}