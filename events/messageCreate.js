const { Events } = require('discord.js');
const ms = require('ms');
const source = require('../util/Modules/Game/spawner.js') //mob spawner
const sentMob = new Set()
const ServerModel = require('../util/Mongoose/models/Server')
module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        client = message.client;
        let Server = await client.UtilFunctions.getGuildData(message.guild.id)
        if (message.author.bot) return;
        if (sentMob.has(message.guild.id)) return;
        try {
            source(message);
            if (Server.ServerGameSettings.Planet != "None" && Server.ServerGameSettings.Arc != "None") {
                sentMob.add(message.guild.id);
                setTimeout(() => {
                    sentMob.delete(message.guild.id);

                    client.PlayerAttacked.clear()
                }, ms('2 min'));
            }

        } catch (error) {
            console.error(`An error occurred while executing the MessageCreate event: ${error}`);
        }
    }
}