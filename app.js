const { Client, GatewayIntentBits, Collection, Events, PermissionFlagsBits } = require('discord.js')
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages] })

const fs = require('node:fs')
const path = require('node:path')

const eventsFolder = path.join(__dirname, 'events')
const CommandsFolder = path.join(__dirname, 'Commands')
const isButtonFolder = path.join(__dirname, 'events', 'Interaction', 'isButton()');
const evntsFiles = fs.readdirSync(eventsFolder).filter(file => file.endsWith('.js'))
const cmdFiles = fs.readdirSync(CommandsFolder).filter(file => file.endsWith('.js'))
const ButtonFiles = fs.readdirSync(isButtonFolder).filter(file => file.endsWith('.js'))

client.commands = new Collection()
client.ButtonEventsName = new Collection()



client.on("ready", () => {
    console.log("The bot is ready!.")
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
        } else {
            console.log(filePath + "is missing some properties.")
        }
    }
    for (const file of ButtonFiles) {
        const ButtonFile = require(path.join(isButtonFolder, file))
        console.log(ButtonFile.customId)
        client.ButtonEventsName.set(ButtonFile.customId, ButtonFile)
    }
    client.UtilFunctions = require('./util/functions.js')
    client.UtilFunctions.init(client)
    client.cooldown = new Set()
    client.PlayerAttacked = new Set();
})

client.login("MTAzMjAxNDA4OTUxOTY0ODc2OA.GT_jMF.n3NR3Xs8O2Va-se-Npb84ziKPya7cgSLWJMljI")