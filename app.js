const { Client, GatewayIntentBits, Collection, Events, PermissionFlagsBits } = require('discord.js')
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages] })
const ClientKey = "";
const fs = require('node:fs')
const path = require('node:path')

const eventsFolder = path.join(__dirname, 'events')
const CommandsFolder = path.join(__dirname, 'Commands')
const evntsFiles = fs.readdirSync(eventsFolder).filter(file => file.endsWith('.js'))
const cmdFiles = fs.readdirSync(CommandsFolder).filter(file => file.endsWith('.js'))
client.commands = new Collection()

client.on("messageCreate", (message) => {
    message.guild.members.me.permissionsIn(message.channelId).has([PermissionFlagsBits.SendMessages])
})
client.on("ready", () => {
    console.log("The bot is ready!.")
    namesOfCommands = []
    for (const file of evntsFiles) {
        const filePath = path.join(eventsFolder, file)
        const event = require(filePath)
        if (event.once) {
            client.once(event.name, (args) => event.execute(args))
        } else {
            client.on(event.name, (args) => event.execute(args))
        }
    }
    for (const file of cmdFiles) {
        const filePath = path.join(CommandsFolder, file)
        const command = require(filePath)
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command)
            namesOfCommands.push(command.data.name)
        } else {
            console.log(filePath + "is missing some properties.")
        }
    }

    client.UtilFunctions = require('./util/functions.js')
    client.UtilFunctions.init(client)
    client.cooldown = new Set()
    client.PlayerAttacked = new Set();
    client.MobAttack = new Set()
})

client.login(ClientKey)
