const { SlashCommandBuilder, EmbedBuilder, inlineCode, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, ComponentType } = require("discord.js");
const PlayerModel = require('../util/Mongoose/models/Player')
const Attacks = require('../util/Modules/Game/Attacks.json')
const SkillClass = require('../util/Modules/Game/Skills/SkillsClass')
module.exports = {
    data: new SlashCommandBuilder().setName("skill").setDescription("Allows you to view a skill or equip it").addStringOption(option => option.setName('choice').setDescription('equip or view the skill').setRequired(true)).addStringOption(option => option.setName('id').setDescription('the id of the skill').setRequired(true)),
    restricted: true,
    async execute(interaction) {
        let getOptions = ['view', 'equip']
        let getUserChoice = interaction.options.getString('choice')
        let getUserSkillChoice = interaction.options.getString('id')
        if (!getOptions.includes(getUserChoice.toLowerCase())) {
            return interaction.reply("Please input a correct choice.")
        }
        let GetItem = await new SkillClass(getUserSkillChoice)
        if (GetItem == null) {
            return interaction.reply("Item ID is invalid as it does not exist in the skill store")
        }
        if (getUserChoice == getOptions[0]) {
            let TheEmbed = new EmbedBuilder()
                .setColor('Random')
                .setTitle(GetItem.getSkillProperty('name'))
                .setDescription(GetItem.getSkillProperty('Description'))
                .addFields({ name: 'ItemID', value: GetItem.getSkillProperty('itemid') }, {
                    name: 'Damage',
                    value: GetItem.getSkillProperty('damage').toString()
                }, {
                    name: 'Stamina Cost',
                    value: GetItem.getSkillProperty('staminacost').toString()
                }, { name: 'Cost', value: GetItem.getSkillProperty('cost').toString() }, { name: 'Accuray Rate', value: GetItem.getSkillProperty('accurayrate').toString() }, {
                    name: 'Stats Required',
                    value: JSON.stringify(GetItem.getSkillProperty('statsrequired')).replace(/[{[\]}"]/g, '').replace(/,/g, '\n')
                }, )

            return interaction.reply({ embeds: [TheEmbed] })
        } else if (getUserChoice == getOptions[1]) {
            //do the below findmove and findmove if it exists already
            let FindMove = await GetItem.CheckUserHasSkill(await PlayerModel.findOne({ ServerID: interaction.guild.id, UserID: interaction.user.id }))
            if (FindMove == false) {
                let TheEmbed = new EmbedBuilder()
                    .setTitle('Move does not exist')
                    .setColor('Red')
                    .setDescription("You currently don't own this move to equip it.")
                return interaction.reply({
                    embeds: [TheEmbed],
                    ephemeral: true
                })
            }
            let SlotPlace1 = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                .setCustomId('s1')
                .setLabel('Move Set 1')
                .setStyle(ButtonStyle.Success)
            )
            let SlotPlace2 = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                .setCustomId('s2')
                .setLabel('Move Set 2')
                .setStyle(ButtonStyle.Success)
            )
            let SlotPlace3 = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                .setCustomId('s3')
                .setLabel('Move Set 3')
                .setStyle(ButtonStyle.Success)
            )
            let SlotPlace4 = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                .setCustomId('s4')
                .setLabel('Move Set 4')
                .setStyle(ButtonStyle.Success)
            )
            let TheEmbed = new EmbedBuilder()
                .setTitle('Equipping moveset')
                .setDescription(`Where should ${GetItem.Skill.Name} be placed in the sets.`)
                .setColor('Red')
            interaction.reply({ embeds: [TheEmbed], components: [SlotPlace1, SlotPlace2, SlotPlace3, SlotPlace4], ephemeral: true })
            let filter = i => i.user.id === interaction.user.id
            let collector = interaction.channel.createMessageComponentCollector({ ComponentType: ComponentType.Button, time: 40000, max: 1 })
            let CongratsEmbed = new EmbedBuilder()
                .setColor('Green')
                .setTitle('Equipped')
            collector.on('collect', async i => {
                await i.deferUpdate();
                switch (i.customId) {
                    case "s1":
                        let S1Checker = GetItem.equip({ ServerID: interaction.guild.id, UserID: interaction.user.id }, 'S1')
                        if (S1Checker == false) {
                            CongratsEmbed.setColor('Red')
                            CongratsEmbed.setDescription("Can't equip this move as it's already in the moveset.")
                            CongratsEmbed.setTitle('Issue')
                            return i.editReply({
                                embeds: [CongratsEmbed]
                            })
                        }
                        CongratsEmbed.setDescription(`Equipped ${GetItem.Skill.Name} to Slot Number 1`)
                        return i.editReply({
                            embeds: [CongratsEmbed]
                        })
                    case "s2":
                        let S2Checker = GetItem.equip({ ServerID: interaction.guild.id, UserID: interaction.user.id }, 'S2')
                        if (S2Checker == false) {
                            CongratsEmbed.setColor('Red')
                            CongratsEmbed.setDescription("Can't equip this move as it's already in the moveset.")
                            CongratsEmbed.setTitle('Issue')
                            return i.editReply({
                                embeds: [CongratsEmbed]
                            })
                        }
                        CongratsEmbed.setDescription(`Equipped ${GetItem.Skill.Name} to Slot Number 2`)
                        return i.editReply({
                            embeds: [CongratsEmbed]
                        })
                    case "s3":
                        let S3Checker = GetItem.equip({ ServerID: interaction.guild.id, UserID: interaction.user.id }, 'S3')
                        if (S3Checker == false) {
                            CongratsEmbed.setColor('Red')
                            CongratsEmbed.setDescription("Can't equip this move as it's already in the moveset.")
                            CongratsEmbed.setTitle('Issue')
                            return i.editReply({
                                embeds: [CongratsEmbed]
                            })
                        }
                        CongratsEmbed.setDescription(`Equipped ${GetItem.Skill.Name} to Slot Number 3`)
                        return i.editReply({
                            embeds: [CongratsEmbed]
                        })
                    case "s4":
                        let S4Checker = GetItem.equip({ ServerID: interaction.guild.id, UserID: interaction.user.id }, 'S3')
                        if (S4Checker == false) {
                            CongratsEmbed.setColor('Red')
                            CongratsEmbed.setDescription("Can't equip this move as it's already in the moveset.")
                            CongratsEmbed.setTitle('Issue')
                            return i.editReply({
                                embeds: [CongratsEmbed]
                            })
                        }
                        CongratsEmbed.setDescription(`Equipped ${GetItem.Skill.Name} to Slot Number 4`)
                        return i.editReply({
                            embeds: [CongratsEmbed]
                        })

                }
            })
        }
    }
}

function getItemsThatHaveHigherStatsThanZero(Skill) {
    const { Strength, Speed, Defense, "Ki Control": Ki } = Skill
    let Result = []
    if (Strength > 0) {
        Result.push("Strength")
    } else
    if (Speed > 0) {
        Result.push("Speed")

    } else if (Defense > 0) {
        Result.push("Defense")

    } else if (Ki > 0) {
        Result.push("Ki Control")

    } else {
        Result = "None"
    }
    return Result.length > 0 ? Result : null;
}