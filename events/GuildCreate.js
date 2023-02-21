const { Events } = require('discord.js')

module.exports = {
    name: Events.GuildCreate,
    async execute(newGuild) {
        client = newGuild.client
        if (client.UtilFunctions.DidGuildAlreadyExists(newGuild.id) == true) {
            return;
        } else if (client.UtilFunctions.DidGuildAlreadyExists(newGuild.id) == false) {
            await client.UtilFunctions.connectMD();
            await client.UtilFunctions.createServerDataFile(newGuild.id)
        }
    }
}