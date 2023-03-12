const { PermissionFlagsBits, EmbedBuilder, Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, StringSelectMenuBuilder } = require('discord.js')
const Server = require('../../Mongoose/models/Server')
const Duration = require('humanize-duration')

const DataMap = new Map()
const { RunGame, addExp, chooseNewPlanet, chooseNewSaga, chooseANewMob, getImageUrl, getMobType, PlayersAttacks } = require('./GameModules')
module.exports = async(message) => {
    if (message.author.bot) return;
    if (!message.guild.members.me.permissionsIn(message.channelId).has([PermissionFlagsBits.SendMessages])) return;
    let client = message.client

    let Player = message.author.id;
    if (client.PlayerAttacked.has(Player.id + "a")) {
        let ResponseDuration = Duration(client.PlayerAttacked.get(Player.id + "a") - Date.now(), { units: ['h', 'm', 's'], round: true })
        let TheEmbed = new EmbedBuilder()
            .setAuthor({
                name: message.member.user.username,
                iconURL: message.member.user.displayAvatarURL()

            })
            .setColor('Red')
            .setTitle('Issue')
            .setDescription('You have already attacked. Sorry')
            .addFields({ name: 'Next time you can attack.', value: ResponseDuration.toLowerCase() })
        return interaction.reply({ embeds: { TheEmbed } })
    }
    let Guild = await client.UtilFunctions.getGuildData(message.guildId);
    let { Mob, ServerGameSettings, MobsCount } = Guild
    let { Planet, Arc } = ServerGameSettings;
    let { NormalMob, SemiMob, Bosses } = MobsCount
    if (Planet == "None") {
        let RandomImage = getImageUrl('random')
        let embed = new EmbedBuilder()
        embed.setTitle("Traveling to a new planet...")
        embed.setAuthor({
            name: message.client.user.tag,
            iconURL: message.client.user.displayAvatarURL({ dynamic: true })
        })
        embed.setImage(RandomImage)
        const sentMessage = await message.channel.send({ embeds: [embed] });

        async function deleteMessage() {
            // Wait for 9 seconds before deleting the message
            await new Promise(resolve => setTimeout(resolve, 9000));
            await sentMessage.delete();
            let ChoosingPlanet = await chooseNewPlanet();
            let getImagePlanet = getImageUrl(ChoosingPlanet);
            let newArc = await chooseNewSaga(ChoosingPlanet)
            let ArcImage = getImageUrl(newArc)
            let chosenPlanet = new EmbedBuilder();
            chosenPlanet.setAuthor({
                name: message.client.user.tag,
                iconURL: message.client.user.displayAvatarURL({ dynamic: true }),
            });
            let ArcBuilder = new EmbedBuilder().setAuthor({
                name: message.client.user.tag,
                iconURL: message.client.user.displayAvatarURL({ dynamic: true }),
            }).setTitle("Arc: " + newArc).setImage(ArcImage)
            chosenPlanet.setTitle(ChoosingPlanet);
            chosenPlanet.setImage(getImagePlanet);
            await message.channel.send({ embeds: [chosenPlanet, ArcBuilder] });
            await Server.updateOne({ ServerID: message.guild.id }, {
                $set: {
                    ServerGameSettings: {
                        Planet: ChoosingPlanet,
                        Arc: newArc
                    },
                },
            });
        }

        // Call the async function
        return await deleteMessage();
    } else if (Planet != "None" && Arc != "None" && Mob.Name == "None" && getMobType(Guild) != "None") {
        let getTheTypeofMob = getMobType(Guild)
        let TheMob = chooseANewMob(Planet, Arc, getTheTypeofMob)
        let { Name, Description, Health, MaxHealth, Level, Exp, MaxExp, ImageURL } = TheMob
        let MobEmbed = new EmbedBuilder()
        MobEmbed.setTitle(Name)
        MobEmbed.setColor(Colors.Red)
        MobEmbed.setDescription(Description)
        MobEmbed.setThumbnail(ImageURL)
        MobEmbed.addFields([{
            name: 'Health',
            value: Health.toString(),
            inline: true,
        }, {
            name: 'Max Health',
            value: MaxHealth.toString(),
            inline: true,
        }, {
            name: 'Level',
            value: Level.toString()
        }, {
            name: 'Exp/MaxExp',
            value: Exp.toString() + "/" + MaxExp.toString()
        }])

        await Server.updateOne({ ServerID: message.guild.id }, {
            $set: {
                Mob: TheMob
            }
        })

        let AttackButton = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('attackbutton').setLabel('Attack').setStyle(ButtonStyle.Success))
        return message.channel.send({
            embeds: [MobEmbed],
            components: [AttackButton]
        })
    } else if (Planet != "None" && Arc != "None" && Mob.Name != "None" && getMobType(Guild) != "None") {
        let { Name, Description, Health, MaxHealth, Level, Exp, MaxExp, ImageURL } = Mob
        let MobEmbed = new EmbedBuilder()
        MobEmbed.setTitle(Name)
        MobEmbed.setColor(Colors.Red)
        MobEmbed.setDescription(Description)
        MobEmbed.setThumbnail(ImageURL)
        MobEmbed.addFields([{
            name: 'Health',
            value: Health.toString(),
            inline: true,
        }, {
            name: 'Max Health',
            value: MaxHealth.toString(),
            inline: true,
        }, {
            name: 'Level',
            value: Level.toString()
        }, {
            name: 'Exp/MaxExp',
            value: Exp.toString() + "/" + MaxExp.toString()
        }])

        let AttackButton = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('attackbutton').setLabel('Attack').setStyle(ButtonStyle.Success))

        return message.channel.send({
            embeds: [MobEmbed],
            components: [AttackButton]
        })
    } else if (Planet != "None" && Arc != "None" && Mob.Name != "None" && getMobType(Guild) == "None") {
        MobsCount.NormalMob = 0
        MobsCount.SemiMob = 0
        MobsCount.Bosses = 0
        ServerGameSettings.Planet = "None"
        ServerGameSettings.Arc = "None"
        Mob.Name = "None"
        await Server.updateOne({ ServerID: message.guild.id }, {
            $set: {
                ServerGameSettings: ServerGameSettings,
                MobsCount: MobsCount,
                Mob: Mob
            }
        }).then(() => {
            console.log("Updated a document for guild " + message.guild.id)
        })
        return message.channel.send("Restarting the spawner.")
    } else if (Planet != "None" && Arc != "None" && Mob.Name == "None" && getMobType(Guild) == "None") {
        MobsCount.NormalMob = 0
        MobsCount.SemiMob = 0
        MobsCount.Bosses = 0
        ServerGameSettings.Planet = "None"
        ServerGameSettings.Arc = "None"
        Mob.Name = "None"
        await Server.updateOne({ ServerID: message.guild.id }, {
            $set: {
                ServerGameSettings: ServerGameSettings,
                MobsCount: MobsCount,
                Mob: Mob
            }
        }).then(() => {
            console.log("Updated a document for guild " + message.guild.id)
        })
        return message.channel.send("Restarting the spawner.")

    }



}