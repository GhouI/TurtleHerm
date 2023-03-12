const { Events, EmbedBuilder } = require('discord.js');
const ms = require('ms');
const source = require('../util/Modules/Game/spawner.js') //mob spawner
const SentError = new Set()
const Duration = require('humanize-duration')

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        client = message.client;
        let Server = await client.UtilFunctions.getGuildData(message.guild.id)
        if (Server == null) {
            return;
        }
        if (message.author.bot) return;
        if (SentError.has(message.author.id)) return;
        if (client.PlayerAttacked.has(message.author.id + "a")) {
            SentError.add(message.author.id);
            setTimeout(() => {
                SentError.delete(message.author.id)
            }, 12000)
            let ResponseDuration = Duration(client.PlayerAttacked.get(message.author.id + "a") - Date.now(), { units: ['h', 'm', 's'], round: true })
            let TheEmbed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('Issue')
                .setDescription('We are already searching for an arc to play with.')
                .addFields({ name: 'Next time you can send a message.', value: ResponseDuration.toString() })
            return message.reply({ embeds: [TheEmbed] })


        }
        try {
            source(message);
            client.PlayerAttacked.set(message.author.id + "a", Date.now() + 120000)
            setTimeout(() => {
                client.PlayerAttacked.delete(message.author.id + "a")
            }, 120000)

        } catch (error) {
            console.error(`An error occurred while executing the MessageCreate event: ${error}`);
        }
    }
}