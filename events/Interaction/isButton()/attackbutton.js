const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js')
const { PlayersAttacks, checkPlayerStatus, getValidAttacks, CheckIfPlayerHasAnyMoves } = require('../../../util/Modules/Game/GameModules')
const Duration = require('humanize-duration')


const PlayerModel = require('../../../util/Mongoose/models/Player')
const ServerModel = require('../../../util/Mongoose/models/Server')

const path = require('path')
module.exports = {
    customId: path.basename(__filename, '.js'),

    async execute(interaction) {

        const client = interaction.client;
        let Player = interaction.user
        let Server = interaction.guild
        let APlayer = await PlayerModel.findOne({ ServerID: Server.id, UserID: Player.id })
        if (APlayer == null || CheckIfPlayerHasAnyMoves(APlayer) == false) {
            return interaction.reply("You can't attack because you don't have any moves.")
        }
        let { PlayerHealth, PlayerMoveSet } = APlayer
        let { Mob } = await ServerModel.findOne({ ServerID: Server.id })
        if (Mob.Health == 0) {
            let TheEmbed = new EmbedBuilder()
                .setAuthor({
                    name: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL()
                })
                .setColor('Red')
                .setTitle('Issue')
                .setDescription(`${interaction.user.username}, you can't attack the mob because it has 0 HP.`)
            return interaction.reply({ embeds: [TheEmbed] })
        }
        let getPlayerAttacks = await PlayersAttacks(Server.id, Player.id)
        let GetPlayerStatus = await checkPlayerStatus(PlayerHealth.Health, PlayerHealth.Stamina)
        if (GetPlayerStatus == "Health" || GetPlayerStatus == "Stamina") {
            client.PlayerAttacked.delete(Player.id + "a")
            let TheEmbed = new EmbedBuilder()
                .setAuthor({
                    name: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL()
                })
                .setColor('Red')
                .setTitle('Issue')
                .setDescription(`${interaction.user.username}, you have 0 of ${GetPlayerStatus}`)
            return interaction.reply({ embeds: [TheEmbed] })
        }

        const PlayersAttack = await getValidAttacks(getPlayerAttacks)
        const DataRow = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId('MobMenuAttack')
                .setPlaceholder('Select an Attack.')
                .addOptions(PlayersAttack))
        return interaction.reply({ components: [DataRow] })
    }
}