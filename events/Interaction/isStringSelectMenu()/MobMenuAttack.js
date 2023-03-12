const path = require('path')
const PlayerModel = require('../../../util/Mongoose/models/Player')
const ServerModel = require('../../../util/Mongoose/models/Server')

const { Events, PermissionFlagsBits, EmbedBuilder, Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, StringSelectMenuBuilder } = require('discord.js')

const { PlayersAttacks, doesAttackExist, checkPlayerStatus, getValidAttacks, getAttack, ChooseRandomMove, getMobType, CalculatePlayerDamage, CalculateMobDamage, addExp } = require('../../../util/Modules/Game/GameModules')
module.exports = {
    customId: path.basename(__filename, '.js'),

    async execute(interaction) {
        let client = interaction.client
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
        let { Name, Description, Damage, StaminaCost, AccurayRate, MoveType } = await getAttack(interaction.values[0]);
        let { Health, Stamina } = PlayerHealth
        if (Stamina - StaminaCost < 0) {
            interaction.channel.send(`<@${Player.id}>, you cannot attack because you do not have enough stamina.`)
        }
        let CalcDamage = Math.floor(await CalculatePlayerDamage(Damage, XPlayer, MoveType))
        Stamina -= StaminaCost;
        let SelectedMove = await ChooseRandomMove(Mob.Moves, Mob.Stamina);
        Mob.Stamina -= await SelectedMove.StaminaUse;
        Mob.Health -= CalcDamage
        let MobDamage = await CalculateMobDamage(SelectedMove.Damage, Mob, SelectedMove.Type)
        PlayerHealth.Health = Math.max(0, Math.abs(PlayerHealth.Health - MobDamage));
        PlayerHealth.Stamina = Math.max(0, Math.abs(PlayerHealth.Stamina - StaminaCost))
        await PlayerModel.updateOne({ ServerID: Server.id, UserID: Player.id }, {
            $set: {
                PlayerHealth: XPlayer.PlayerHealth
            }
        });
        console.log(Mob)

        if (Mob.Health >= 0) {
            switch (await getMobType(XServer)) {
                case "NormalMob":
                    client.PlayerAttacked.delete(Player.id + "a")
                    addExp(Server.id, Player.id, Mob.ExpGain)
                    MobsCount.NormalMob += 1
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
                case "SemiMob":
                    addExp(Server.id, Player.id, Mob.ExpGain)
                    client.PlayerAttacked.delete(Player.id + "a")
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
                    addExp(Server.id, Player.id, Mob.ExpGain)
                    client.PlayerAttacked.delete(Player.id + "a")
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
                    addExp(Server.id, Player.id, Mob.ExpGain)
                    client.PlayerAttacked.delete(Player.id + "a")

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
            let theembed = new EmbedBuilder()
                .setAuthor({
                    name: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL()
                })
                .setColor('Red')
                .setTitle('Issue')
                .setDescription(`${interaction.user.username}, your health has been reduced to 0 by the mob's attack.`)
            interaction.channel.send({ embeds: [theembed] })
        } else {
            let theembed = new EmbedBuilder()
                //`<@${Player.id}>, the mob attacked you and dealt ${MobDamage} damage to your health. Your health is now ${PlayerHealth.Health}. You did ${CalcDamage} Damage.`
                .setAuthor({
                    name: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL()
                })
                .setColor('Random')
                .setTitle('Recent Attack against Mob')
                .addFields({ name: 'Player Attacked', value: interaction.user.username }, {
                    name: 'Player Damage Infiliction',
                    value: CalcDamage.toString()
                }, {
                    name: 'Mob Damage Inficlited',
                    value: MobDamage.toString()
                })
            interaction.channel.send({ embeds: [theembed] })
        }



    }
}