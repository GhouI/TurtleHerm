const shop = require('../util/Modules/Game/Items/ItemsList.json')
const Skills = require('../util/Modules/Game/Attacks.json')
const pagination = require('../util/pagination')
const PlayerModel = require('../util/Mongoose/models/Player')
const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } = require('discord.js')
module.exports = {
    data: new SlashCommandBuilder().setName("shop").setDescription("Purchase a skill from the item shop.").addStringOption(cmd => cmd.setName('choice').setDescription('Choices are Purchase or View item')).addStringOption(cmd => cmd.setName('id').setDescription('provide the item id you want to purchase or view')).addStringOption(quan => quan.setName('quantity').setDescription('How much you want of that item')),
    restricted: true,
    async execute(interaction) {
        let Choice = interaction.options.getString('choice')
        let ItemIDProvided = interaction.options.getString('id')
        if (Choice == null) {
            let ArrayOfElements = []
            for ([key, value] of Object.entries(shop)) {
                for (Item of shop[key]) {
                    ArrayOfElements.push({
                        name: Item.Name.toString(),
                        value: `Description: ${Item.Description.toString()}\nItem ID:${Item.ItemId.toString()}`
                    })
                }
            }
            await pagination('Shop', interaction, ArrayOfElements, 1, 5)
        }
        let AllowedOptions = ['purchase', 'view']

        if (Choice != null && ItemIDProvided == null) {
            let TheEmbed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('No Item ID Provided')
                .setDescription('Please provide me with an item id to search')
            return interaction.reply({ embeds: [TheEmbed], ephemeral: true })
        }
        if (!AllowedOptions.includes(Choice)) {
            let TheEmbed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('Invalid choice')
                .setDescription('Please provide a correct choice. purchase or view is allowed.')
            return interaction.reply({ embeds: [TheEmbed], ephemeral: true, })
        }
        let { Zeni, PlayerInventoryMoves, PlayerStats, PlayerInventory } = await PlayerModel.findOne({ ServerID: interaction.guild.id, UserID: interaction.user.id })
        if (AllowedOptions[0] == Choice) {
            let SearchShop = searchItemShop(ItemIDProvided)
            let SearchSkill = searchItemSkill(ItemIDProvided)
            if (SearchShop == null && SearchSkill == null) {
                let TheEmbed = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('Item ID provided is invalid')
                    .setDescription('The Item ID you provided is invalid. Please try again.')
                return interaction.reply({ embeds: [TheEmbed], ephemeral: true, })
            }
            if (SearchShop != null) {
                let { Name, Description, Cost } = SearchShop
                let Quantity = interaction.options.getString('quantity') || 1
                let getItemFinalPrice = parseInt(Quantity) * Cost
                if (Zeni > getItemFinalPrice) {
                    Zeni -= getItemFinalPrice
                    SearchShop['Quantity'] = Quantity
                    PlayerInventory.push(SearchShop)
                    await PlayerModel.updateOne({ ServerID: interaction.guild.id, UserID: interaction.user.id }, {
                        $set: {
                            Zeni: Zeni,
                            PlayerInventory: PlayerInventory
                        }
                    })
                    let TheEmbed = new EmbedBuilder()
                        .setColor('Green')
                        .setTitle('Item Purchased. ' + Name)
                        .setDescription(`You have purchased the item of ${Name}.`)
                        .addFields({
                            name: 'Quantity',
                            value: Quantity.toString()
                        }, {
                            name: 'Price',
                            value: getItemFinalPrice.toString(),
                        })
                    return interaction.reply({ embeds: [TheEmbed], ephemeral: true, })

                } else {
                    let TheEmbed = new EmbedBuilder()
                        .setColor('Red')
                        .setTitle('Not enough to purchase Item.')
                        .setDescription(`You need ${getItemFinalPrice - Zeni} Zeni to purchase this item.`)
                    return interaction.reply({ embeds: [TheEmbed], ephemeral: true, })
                }
            } else if (SearchSkill != null) {
                let { Name, ItemID, Cost, StatsRequired } = SearchSkill
                let CheckSkill = getItemsThatHaveHigherStatsThanZero(SearchSkill)
                if (CheckSkill == null) {
                    if (Zeni > Cost) {
                        Zeni -= Cost;
                        PlayerInventoryMoves.push(SearchSkill)
                        await PlayerModel.updateOne({ ServerID: interaction.guild.id, UserID: interaction.user.id }, {
                            $set: {
                                Zeni: Zeni,
                                PlayerInventoryMoves: PlayerInventoryMoves
                            }
                        })
                        let TheEmbed = new EmbedBuilder()
                            .setColor('Green')
                            .setTitle('Skill Purchased. ' + Name)
                            .setDescription(`You have purchased the skill of ${Name}.`)
                            .addFields({
                                name: 'Price',
                                value: Cost.toString(),
                            })
                        return interaction.reply({ embeds: [TheEmbed], ephemeral: true, })
                    } else {
                        let TheEmbed = new EmbedBuilder()
                            .setColor('Red')
                            .setTitle('Not enough to purchase Item.')
                            .setDescription(`You need ${Cost - Zeni} Zeni to purchase this item.`)
                        return interaction.reply({ embeds: [TheEmbed], ephemeral: true, })
                    }
                } else if (CheckSkill != null) {
                    if (Zeni < Cost) {
                        let TheEmbed = new EmbedBuilder()
                            .setColor('Red')
                            .setTitle('Not enough to purchase Item.')
                            .setDescription(`You need ${Cost - Zeni} Zeni to purchase this item.`)
                        return interaction.reply({ embeds: [TheEmbed], ephemeral: true, })
                    }
                    let NeededStats = []
                    for (i = 0; i < CheckSkill.length; i++) {
                        if (CheckSkill[i] == 'Strength') {
                            if (PlayerStats.Strength < StatsRequired.Strength) {
                                NeededStats.push("Strength")
                            }
                        } else if (CheckSkill[i] == 'Speed') {
                            if (PlayerStats.Speed < StatsRequired.Speed) {
                                NeededStats.push("Speed")
                            }
                        } else if (CheckSkill[i] == 'Defense') {
                            NeededStats.push("Defense")
                        } else if (CheckSkill[i] == 'Ki Control') {
                            NeededStats.push("i Control")
                        }
                    }
                    if (NeededStats.length > 0) {
                        let TheEmbed = new EmbedBuilder()
                            .setTitle('Stats Required')
                            .setColor('Red')
                            .setDescription("Unfortunatley, You don't have the required stats to purchase this item.")
                            .addFields({ name: 'The Stats you need', value: NeededStats.toString() })
                        return interaction.reply({ embeds: [TheEmbed] })
                    }
                    Zeni -= Cost;
                    PlayerInventoryMoves.push(SearchSkill)
                    await PlayerModel.updateOne({ ServerID: interaction.guild.id, UserID: interaction.user.id }, {
                        $set: {
                            Zeni: Zeni,
                            PlayerInventoryMoves: PlayerInventoryMoves
                        }
                    })
                    let TheEmbed = new EmbedBuilder()
                        .setColor('Green')
                        .setTitle('Skill Purchased. ' + Name)
                        .setDescription(`You have purchased the skill of ${Name}.`)
                        .addFields({
                            name: 'Price',
                            value: Cost.toString(),
                        })
                    return interaction.reply({ embeds: [TheEmbed], ephemeral: true, })
                }
            }
        } else if (AllowedOptions[1] == Choice) {
            let SearchShop = searchItemShop(ItemIDProvided)
            let SearchSkill = await searchItemSkill(ItemIDProvided)
            if (SearchShop == null && SearchSkill == null) {
                let TheEmbed = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('Item ID provided is invalid')
                    .setDescription('The Item ID you provided is invalid. Please try again.')
                return interaction.reply({ embeds: [TheEmbed], ephemeral: true, })
            }
            if (SearchSkill != null) {
                let TheEmbed = new EmbedBuilder()
                    .setColor('Random')
                    .setTitle(SearchSkill.Name)
                    .setDescription(SearchSkill.Description)
                    .addFields({
                        name: "Damage",
                        value: SearchSkill.Damage.toString()
                    }, {
                        name: "Stamina Cost",
                        value: SearchSkill.StaminaCost.toString()

                    }, {
                        name: "Cost",
                        value: SearchSkill.Cost.toString()

                    }, {
                        name: "Accuracy Rate",
                        value: SearchSkill.StaminaCost.toString()

                    }, {
                        name: "Stats Required",
                        value: getItemsThatHaveHigherStatsThanZero.toString(),

                    })
                return interaction.reply({ embeds: [TheEmbed], ephemeral: true, })
            } else if (SearchShop != null) {
                let TheEmbed = new EmbedBuilder()
                if (typeof(SearchShop.Effect) == 'object') {
                    TheEmbed.addFields({
                        name: 'Armor Type',
                        value: SearchShop.Effect.ArmorType,
                    }, {
                        name: 'Effect Type',
                        value: SearchShop.Effect.EffectType.toString(),
                    }, {
                        name: 'Effect Value',
                        value: SearchShop.Effect.EffectValue.toString(),
                    })
                }

                TheEmbed.setColor('Random')
                TheEmbed.setTitle(SearchShop.Name)
                TheEmbed.setDescription(SearchShop.Description)
                TheEmbed.addFields({
                    name: "Rarity",
                    value: SearchShop.Rarity.toString()
                }, {
                    name: "Cost",
                    value: SearchShop.Cost.toString(),

                })
                return interaction.reply({ embeds: [TheEmbed], ephemeral: true, })
            }
        }


    }
}

function searchItemShop(ItemID) {
    for ([key, value] of Object.entries(shop)) {
        for (Item of shop[key]) {
            if (Item.ItemId == ItemID) {
                return Item;
            }
        }
    }
    return null
}

function searchItemSkill(ItemID) {
    for ([key, value] of Object.entries(Skills)) {
        for (Skill of Skills[key].ListOfAttacks) {
            if (Skill.ItemID == ItemID) {
                return Skill
            }
        }
    }
    return null
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