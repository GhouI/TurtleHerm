const { EmbedBuilder } = require('discord.js')
const PlayerModel = require('../../../util/Mongoose/models/Player')
const path = require('path')
module.exports = {
    customId: path.basename(__filename, '.js'),
    async execute(interaction) {
        let Player = interaction.user
        let { PlayerArmor } = await PlayerModel.findOne({ ServerID: interaction.guild.id, UserID: Player.id })
        let Comp = []
        let RemoveAllArmorButton = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('removeallarmor').setLabel('Remove All of your current armor.').setStyle(ButtonStyle.Danger))
        let RemoveTopButton = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('removetoparmor').setLabel('Remove your top armor').setStyle(ButtonStyle.Danger))
        let RemoveHeadButton = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('removeheadarmor').setLabel('Remove your head armor.').setStyle(ButtonStyle.Danger))
        let RemoveBottomButton = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('removebottomarmor').setLabel('Remove All of your bottom armor.').setStyle(ButtonStyle.Danger))
        switch (true) {
            case typeof(PlayerArmor.Head) === 'object':
                Comp.push(RemoveHeadButton)
                break;
            case typeof(PlayerArmor.Top) === 'object':
                Comp.push(new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('removetoparmor').setLabel('Remove your top armor').setStyle(ButtonStyle.Danger)))
                break;
            case typeof(PlayerArmor.Bottom) === 'object':
                Comp.push(RemoveBottomButton)
                break;
            default:
                console.log(Comp.length)
                if (Comp.length >= 2) {
                    Comp.push(RemoveAllArmorButton)
                }
        }
        let theEmbed = new EmbedBuilder()
            .setTitle("Equipped Armor")
            .setAuthor({
                name: Player.username,
                iconURL: Player.displayAvatarURL()
            })
            .addFields({
                name: 'Head',
                value: PlayerArmor.Head.Name ? PlayerArmor.Head.Name : 'None'
            }, {
                name: 'Top',
                value: PlayerArmor.Top.Name ? PlayerArmor.Top.Name : 'None'
            }, {
                name: 'Bottom',
                value: PlayerArmor.Bottom.Name ? PlayerArmor.Bottom.Name : 'None'
            });

        return interaction.reply({ embeds: [theEmbed], components: Comp })

    }
}