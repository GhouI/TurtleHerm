const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle, Collector, ComponentType } = require('discord.js')
module.exports = class EmbedPages {
    constructor() {

    }

    async init(interaction, ArrayOfElements) {
        const ItemPerPage = 5;
        const numberofpages = Math.ceil(ArrayOfElements.length / ItemPerPage)
        let buttons = this.createBackAndForwardButtons()
        const message = await interaction.reply({ embeds: [this.createShopEmbed(ArrayOfElements.slice(0, ItemPerPage))], components: [buttons] })
        const interactioncollector = await interaction.channel.createMessageComponentCollector({ componentType: ComponentType.Button, time: 15000 });
        let CurrentPage = 1
        interactioncollector.on('collect', collectorinteraction => {
            switch (collectorinteraction.customId) {
                case 'forward':
                    if (CurrentPage < numberofpages) CurrentPage++
                        break;
                case 'back':
                    if (CurrentPage > 1) CurrentPage--
                        break;
                default:
                    return;
            }
            let CurrentStartIndex = (CurrentPage - 1) * ItemPerPage
            let PageItems = ArrayOfElements.slice(CurrentStartIndex, CurrentStartIndex + ItemPerPage)
            return interaction.editReply({ embeds: [this.createShopEmbed(PageItems)] })
        })
    }
    createShopEmbed(items) {
        const AEmbed = new EmbedBuilder()
            .setTitle('Shop')
            .setDescription('Shop for skills.')
            .setColor('Red')
            .addFields(...items)
        return AEmbed
    }
    createBackAndForwardButtons() {
        const Back = new ButtonBuilder({
            custom_id: 'back',
            label: 'Back',
            emoji: '⬅️',
            style: ButtonStyle.Secondary
        })
        const Forward = new ButtonBuilder({
            custom_id: 'forward',
            label: 'Forward',
            emoji: '➡️',
            style: ButtonStyle.Secondary
        })
        return new ActionRowBuilder().addComponents(Back).addComponents(Forward)
    }
}