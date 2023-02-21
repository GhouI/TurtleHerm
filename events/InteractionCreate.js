const { Events, PermissionFlagsBits, EmbedBuilder, Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, StringSelectMenuBuilder } = require('discord.js')
const { PlayersAttacks, doesAttackExist, checkPlayerStatus, getValidAttacks, getAttack, ChooseRandomMove, getMobType } = require('../util/Modules/Game/GameModules')
const fs = require('node:fs')
const path = require('node:path')
const PlayerModel = require('../util/Mongoose/models/Player')
const ServerModel = require('../util/Mongoose/models/Server')
module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        const client = interaction.client;
        const { createTempEmbed } = await client.UtilFunctions
        const ButtonEvents = await client.ButtonEventsName
        if (interaction.isChatInputCommand()) {

            const command = interaction.client.commands.get(interaction.commandName)

            if (!command) {
                return console.log("Command not found.")
            }
            let ServerData = await client.UtilFunctions.getGuildData(interaction.guildId)
            let PlayerData = await PlayerModel.findOne({ ServerID: interaction.guild.id, UserID: interaction.user.id })
            if (command.accountRestricted != null && PlayerData == null) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle("Account needed.")
                        .setDescription("To use this account you need to create an account with the bot. ")
                        .setColor('Red')
                        .setAuthor({
                            name: interaction.user.username,
                            iconURL: interaction.user.displayAvatarURL()
                        })
                    ]
                })
            }
            if (command.restricted == true && ServerData['RegisteredChannel'] != interaction.channel.id) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder().setAuthor({
                            name: interaction.user.username,
                            iconURL: interaction.user.displayAvatarURL({})
                        }).setColor('Red').setDescription(`<@${interaction.user.id}>, you can't use this command in this channel.\nYou can use it in <#${ServerData['RegisteredChannel']}>`)
                    ]
                })
            }
            try {
                await command.execute(interaction)
            } catch (error) {
                console.error(error)
            }
        } else if (interaction.isButton()) {
            let ButtonEvent;

            try {
                ButtonEvent = ButtonEvents.find(event => event.customId == interaction.customId)
                if (!ButtonEvent) return;
                await ButtonEvent.execute(interaction)
            } catch (e) {
                console.log(e.message)
            }
        }
    }
    /*
            if (interaction.customId == "attackbutton") {
                let Player = interaction.user
                let Server = interaction.guild
                if (client.PlayerAttacked.has(Player.id + "a")) return interaction.reply({ embeds: [client.UtilFunctions.createTempEmbed(Player.username, Player.displayAvatarURL(), 'Red', "you can't attack this mob because you have already attacked.")] })
                client.PlayerAttacked.add(Player.id + "a")
                let { Level, Exp, PlayerHealth, PlayerStats, PlayerInventoryMoves, PlayerMoveSet, } = await PlayerModel.findOne({ ServerID: Server.id, UserID: Player.id })
                let { Mob } = await ServerModel.findOne({ ServerID: Server.id })
                if (Mob.Health == 0) return interaction.reply({ embeds: [createTempEmbed(Player.username, Player.displayAvatarURL(), 'Red', "you can't attack because the mob has 0 hp.")] })
                let getPlayerAttacks = await PlayersAttacks(Server.id, Player.id)
                let GetPlayerStatus = await checkPlayerStatus(PlayerHealth.Health, PlayerHealth.Stamina)
                if (GetPlayerStatus == "Health" || GetPlayerStatus == "Stamina") {
                    return interaction.reply({ embeds: [createTempEmbed(Player.username, Player.displayAvatarURL(), 'Red', `<@${Player.id}> It seems that you have 0 ${GetPlayerStatus}.`)] })
                }
                const PlayersAttack = await getValidAttacks(getPlayerAttacks)
                const DataRow = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                        .setCustomId('MobMenuAttack')
                        .setPlaceholder('Select an Attack.')
                        .addOptions(PlayersAttack))
                return interaction.reply({ components: [DataRow] })
            } else if (interaction.customId == "viewplayerinventory") {
                let Player = interaction.user
                let { PlayerInventory } = await PlayerModel.findOne({ ServerID: interaction.guild.id, UserID: interaction.user.id })
                if (PlayerInventory.length == 0) {
                    let TheEmbed = await client.UtilFunctions.createTempEmbed(Player.username, Player.displayAvatarURL(), 'Red', "You have no items in your inventory.")
                    return interaction.reply({ embeds: [TheEmbed] })
                }
            } else if (interaction.customId == "viewplayerstatspoint") {
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
            } else if (interaction.customId == "viewplayermoveset") {
                let Player = interaction.user
                let { PlayerMoveSet } = await PlayerModel.findOne({ ServerID: interaction.guild.id, UserID: interaction.user.id })

                function AddBlankFields(TheObject) {
                    let newArray = []
                    let counter = 0;
                    for (Key in TheObject) {
                        if (typeof TheObject[Key] == "object") {
                            newArray.push({ name: TheObject[Key].Name.toString(), value: TheObject[Key].Description.toString(), inline: true })
                            counter++;
                            if (counter % 2 == 0) {
                                newArray.push({ name: "\u200B", value: "\u200B", inline: true })
                            }
                        }
                    }
                    return newArray
                }
                console.log(PlayerMoveSet)
                let TheEmbed = new EmbedBuilder();
                TheEmbed.setAuthor({
                        name: interaction.user.username,
                        iconURL: interaction.user.displayAvatarURL()
                    })
                    .setFooter({
                        text: "To change your attacks list. Do /attack change command"
                    })
                TheEmbed.setDescription("Here is a list of all your attacks.")
                TheEmbed.setColor('Random')
                TheEmbed.addFields(...AddBlankFields(PlayerMoveSet))
                return interaction.reply({ embeds: [TheEmbed] })
            } else if (interaction.customId == "viewplayersallmoveset") {
                let Player = interaction.user
                let { PlayerInventoryMoves } = await PlayerModel.findOne({ ServerID: interaction.guild.id, UserID: Player.id })
                if (PlayerInventoryMoves.length == 0) {
                    let TheEmbed = await client.UtilFunctions.createTempEmbed(Player.username, Player.displayAvatarURL(), 'Red', 'You have no moves saved.')
                    return interaction.reply({ embeds: [TheEmbed] })


                }
            } else if (interaction.customId == "viewcurrentplayerarmor") {
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

            if (interaction.customId.substring(0, 'remove'.length) === 'remove') {
                let Player = interaction.user
                let { PlayerArmor } = await PlayerModel.findOne({ ServerID: interaction.guild.id, UserID: Player.id })
                let suffix = interaction.customId.substring('remove'.length).trim();
                switch (suffix) {
                    case 'allarmor':
                        removeArmorAndEffects()
                        PlayerArmor = {
                            'Top': 'None',
                            'Head': 'None',
                            'Bottom': 'None'
                        }
                        await PlayerModel.updateOne({ ServerID: interaction.guild.id, UserID: Player.id }, {
                            $set: {
                                PlayerArmor: PlayerArmor
                            }
                        })
                        return interaction.reply("All of your armor has been removed.")
                    case 'toparmor':
                        removeArmorAndEffects()
                        PlayerArmor.Top = 'None'
                        await PlayerModel.updateOne({ ServerID: interaction.guild.id, UserID: Player.id }, {
                            $set: {
                                PlayerArmor: PlayerArmor
                            }
                        })
                        return interaction.reply("All of your armor has been removed.")
                }
            }

            //need to do for when they have more moves.
        } else if (interaction.isStringSelectMenu()) {
            if (interaction.customId == "MobMenuAttack") {
                let Player = interaction.user
                let Server = interaction.guild
                let XPlayer = await PlayerModel.findOne({ ServerID: Server.id, UserID: Player.id })
                let XServer = await ServerModel.findOne({ ServerID: Server.id })
                let { Level, Exp, PlayerHealth, PlayerStats, PlayerInventoryMoves, PlayerMoveSet, } = XPlayer
                let { Mob, ServerGameSettings, MobsCount } = XServer
                let GetPlayerStatus = await checkPlayerStatus(PlayerHealth.Health, PlayerHealth.Stamina)
                if (GetPlayerStatus == "Health" || GetPlayerStatus == "Stamina") {
                    return interaction.channel.send(`<@${Player.id}> It seems that you have 0 ${GetPlayerStatus}.`)
                }
                let CheckIfAttackExists = await doesAttackExist(interaction.values[0])
                if (CheckIfAttackExists == false) return interaction.channel.send(`<@${Player.id}> could not find the attack of ${interaction.values[0]}`)
                let { Name, Description, Damage, StaminaCost, AccurayRate } = await getAttack(interaction.values[0]);
                let { Health, Stamina } = PlayerHealth
                if (Stamina - StaminaCost < 0) {
                    interaction.channel.send(`<@${Player.id}>, you cannot attack because you do not have enough stamina.`)
                }
                Stamina -= StaminaCost;
                let SelectedMove = await ChooseRandomMove(Mob.Moves, Mob.Stamina);
                Mob.Stamina -= await SelectedMove.StaminaUse;
                Mob.Health -= Damage;
                let MobDamage = await SelectedMove.Damage;
                PlayerHealth.Health -= MobDamage;
                PlayerHealth.Stamina -= StaminaCost
                await PlayerModel.updateOne({ ServerID: Server.id, UserID: Player.id }, {
                    $set: {
                        PlayerHealth: XPlayer.PlayerHealth
                    }
                });
                if (Mob.Health >= 0) {
                    switch (await getMobType(XServer)) {
                        case "NormalMob":
                            MobsCount.NormalMob += 1
                            Mob.Name = "None"
                            interaction.channel.send(`The Mob has been slayen by <${Player.id}>`)
                            await ServerModel.updateOne({
                                ServerID: Server.id
                            }, {
                                $set: {
                                    Mob: Mob,
                                    MobsCount: MobsCount
                                }
                            })
                            break
                        case "SemiMob":
                            MobsCount.SemiMob += 1
                            Mob.Name = "None"
                            interaction.channel.send(`The Mob has been slayen by <@${Player.id}>`)
                            await ServerModel.updateOne({
                                ServerID: Server.id
                            }, {
                                $set: {
                                    Mob: Mob,
                                    MobsCount: MobsCount
                                }
                            })
                            break
                        case "Bosses":
                            MobsCount.Bosses += 1
                            Mob.Name = "None"
                            interaction.channel.send(`The Mob has been slayen by <@${Player.id}>`)
                            await ServerModel.updateOne({
                                ServerID: Server.id
                            }, {
                                $set: {
                                    Mob: Mob,
                                    MobsCount: MobsCount
                                }
                            })
                            return
                        case "None":
                            ServerGameSettings.Planet = "None"
                            ServerGameSettings.Arc = "None"
                            MobsCount.NormalMob = 0
                            MobsCount.SemiMob = 0
                            MobsCount.Bosses = 0
                            Mob.Name = "None"
                            await ServerModel.updateOne({
                                ServerID: Server.id
                            }, {
                                $set: {
                                    ServerGameSettings: ServerGameSettings,
                                    Mob: Mob,
                                    MobsCount: MobsCount
                                }
                            })
                            interaction.channel.send(`The Mob has been slayen by <@${Player.id}>. It's time to reset the spawner.`)

                            return
                        default:
                            console.log("Something went wrong")
                    }
                } else if (Mob.Health > 0) {
                    await ServerModel.updateOne({
                        ServerID: Server.id
                    }, {
                        $set: {
                            Mob: Mob,
                            MobsCount: MobsCount
                        }
                    })
                }
                if (PlayerHealth.Health <= 0) {
                    interaction.channel.send(`<@${Player.id}>, your health has been reduced to 0 by the mob's attack.`)
                } else {
                    interaction.channel.send(`<@${Player.id}>, the mob attacked you and dealt ${MobDamage} damage to your health. Your health is now ${PlayerHealth.Health}.`)
                }


                return interaction.reply(interaction.values[0])
            }
        }

    }
    */
}


/*
            { "Name": "Punch", "Description": "Using your Fist", "Damage": 150, "StaminaCost": 10, "Cost": 0, "AccurayRate": 55 }

*/