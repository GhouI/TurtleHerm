const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js')
const { PlayersAttacks, checkPlayerStatus, getValidAttacks } = require('../../../util/Modules/Game/GameModules')


const PlayerModel = require('../../../util/Mongoose/models/Player')
const ServerModel = require('../../../util/Mongoose/models/Server')
module.exports = {
    customId: "attackbutton",
    async execute(interaction) {
        const client = interaction.client;
        const { createTempEmbed } = client.UtilFunctions
        let Player = interaction.user
        let Server = interaction.guild
        if (client.PlayerAttacked.has(Player.id + "a")) return interaction.reply({ embeds: [client.UtilFunctions.createTempEmbed(Player.username, Player.displayAvatarURL(), 'Red', "you can't attack this mob because you have already attacked.")] })
        client.PlayerAttacked.add(Player.id + "a")
        let { PlayerHealth, PlayerMoveSet } = await PlayerModel.findOne({ ServerID: Server.id, UserID: Player.id })
        let { Mob } = await ServerModel.findOne({ ServerID: Server.id })
        if (Mob.Health == 0) return interaction.reply({ embeds: [createTempEmbed(Player.username, Player.displayAvatarURL(), 'Red', "you can't attack because the mob has 0 hp.")] })
        let getPlayerAttacks = await PlayersAttacks(Server.id, Player.id)
        let GetPlayerStatus = await checkPlayerStatus(PlayerHealth.Health, PlayerHealth.Stamina)
        if (GetPlayerStatus == "Health" || GetPlayerStatus == "Stamina") {
            return interaction.reply({ embeds: [createTempEmbed(Player.username, Player.displayAvatarURL(), 'Red', `<@${Player.id}> It seems that you have 0 ${GetPlayerStatus}.`)] })
        }
        const PlayersAttack = await getValidAttacks(getPlayerAttacks)
        console.log(await PlayersAttacks)
        const DataRow = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId('MobMenuAttack')
                .setPlaceholder('Select an Attack.')
                .addOptions(PlayersAttack))
        return interaction.reply({ components: [DataRow] })
    }
}