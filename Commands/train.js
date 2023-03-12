const AlreadyTrained = new Map()
const { addExp } = require('../util/Modules/Game/GameModules.js')
const { getUserDocument } = require('../util/functions')
const Duration = require('humanize-duration')
const { EmbedBuilder } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
let PlayerModel = require('../util/Mongoose/models/Player')
module.exports = {
    data: new SlashCommandBuilder().setName("train").setDescription("gain some exp"),
    restricted: true,
    accountRestricted: true,
    async execute(interaction) {
        let { Zeni } = await PlayerModel.findOne({ ServerID: interaction.guild.id, UserID: interaction.user.id })
        if (AlreadyTrained.has(interaction.user.id + interaction.guild.id)) {
            let Responses = Duration(AlreadyTrained.get(interaction.user.id + interaction.guild.id) - Date.now(), { units: ['h', 'm', 's'], round: true })
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setAuthor({
                        name: interaction.user.username,
                        iconURL: interaction.user.displayAvatarURL()
                    })
                    .setColor('Red')
                    .setTitle("Unable to train.")
                    .setDescription('As you have already trained. You are too tired')
                    .addFields({ name: 'Next time you can train', value: Responses.toLowerCase() })
                ]
            })
        } else {
            AlreadyTrained.set(interaction.user.id + interaction.guild.id, Date.now() + 120000)
            setTimeout(() => {
                AlreadyTrained.delete(interaction.user.id + interaction.guild.id)
            }, 120000)
            let RandomExp = Math.floor(Math.random() * 70000)
            let RandomZeni = Math.floor(Math.random() * 1200)
            let emb = new EmbedBuilder()
                .setAuthor({
                    name: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL()
                })
                .setColor('Green')
                .setTitle("Trained")
                .setDescription('You did some training. You have gained some rewards')
                .addFields({
                    name: 'Gained Exp',
                    value: RandomExp.toString()
                }, {
                    name: 'Gained Zeni',
                    value: RandomZeni.toString()
                })
            interaction.reply({
                embeds: [emb]
            })
            Zeni += RandomZeni
            await PlayerModel.updateOne({ ServerID: interaction.guild.id, UserID: interaction.user.id }, { $set: { Zeni } })
            await addExp(interaction.guild.id, interaction.user.id, RandomExp)
        }
    }
}