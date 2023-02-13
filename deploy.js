const { REST, Routes } = require('discord.js')
const { ClientID, GuildID, token } = require('./util/config.json')
const fs = require('node:fs')

const cmds = []
const cmdsFiles = fs.readdirSync('./Commands').filter(file => file.endsWith('.js'))

for (file of cmdsFiles) {
    const command = require('./Commands/' + file)
    cmds.push(command.data.toJSON())
}

const rest = new REST({ version: '10' }).setToken(token);

(async() => {
    try {
        console.log(`Started refreshing ${cmds.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationGuildCommands(ClientID, GuildID), { body: cmds },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();