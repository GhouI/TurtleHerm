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
        // const { createTempEmbed } = await client.UtilFunctions
        const ButtonEvents = await client.ButtonEventsName
        const SelectMenuEvents = await client.SelectMenuNames
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
                console.log("Button Event Error:" + e)
            }
        } else if (interaction.isStringSelectMenu()) {
            let SelectMenuEvent;

            try {
                SelectMenuEvent = SelectMenuEvents.find(event => event.customId == interaction.customId)
                if (!SelectMenuEvent) return;
                await SelectMenuEvent.execute(interaction)
            } catch (e) {
                console.error(e)
            }
        }
    }
}