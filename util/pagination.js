const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } = require('discord.js')
module.exports = async(PaginationUse, interaction, Elements, page = 1, ItemsPerPage = 6) => {
    const pageCount = Math.ceil(Elements.length / ItemsPerPage)
    let currentPage = 0;
    const Embeds = []
    const PreviousButton = new ActionRowBuilder().addComponents(new ButtonBuilder()
        .setCustomId('previous')
        .setLabel('Previous')
        .setEmoji('🔙')
        .setStyle(ButtonStyle.Primary))
    const NextButton = new ActionRowBuilder().addComponents(new ButtonBuilder()
        .setCustomId('next')
        .setLabel('Next')
        .setEmoji('▶️')
        .setStyle(ButtonStyle.Primary))

    for (i = 0; i < pageCount; i++) {
        const start = i * pageCount;
        const end = start + pageCount;
        const pageElements = Elements.slice(start, end);

        const embed = new EmbedBuilder()
            .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTitle(PaginationUse)
            .setColor('Random')
            .setFooter({
                text: `Page ${i+1} / ${pageCount}`
            })
            .addFields(pageElements);
        Embeds.push(embed);
    }
    let inta = await interaction.reply({ embeds: [Embeds[currentPage]], components: [PreviousButton, NextButton] })
    let filter = i => i.user.id === interaction.user.id;
    let collector = interaction.channel.createMessageComponentCollector({ filter, ComponentType: ComponentType.Button, time: 40000, })
    collector.on('collect', async i => {
        await i.deferUpdate()
        if (!i.isButton()) return;
        if (i.customId == "previous") {
            if (currentPage > 0) {
                currentPage -= 1
            }
        } else if (i.customId == 'next') {
            if (currentPage < pageCount - 1) {
                currentPage += 1
            }
        }

        await i.editReply({
            embeds: [Embeds[currentPage]]
        })

    })

}