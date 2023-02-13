module.exports = async(message) => {
    const Guild = await Server.findOne({
        ServerID: message.guild.id
    })
    const client = await message.client;
    const cooldown = client.cooldown;

    //Settings the Flags up 
    if (cooldown.has(message.guild.id + "s")) return;
    if (Guild.ServerGameSettings.Planet == "None") { //Planet has is none.
        client.cooldown.set(message.guild.id + "s")
        let cacheimage = new modules().getImages('Random')
        let embed = new MessageEmbed()
        embed.setTitle("Traveling to a new planet...")
        embed.setAuthor(message.client.user.tag, message.client.user.displayAvatarURL({ dynamic: true }))
        embed.setImage(new modules().getImages('Random'))
        message.channel.send(embed).then(msg => {
            msg.delete({ timeout: 3500 })
            setTimeout(async() => {
                let embeda = new MessageEmbed()
                let getPlanet = new modules().chooseNewPlanet()
                let getImage = new modules().getImages(getPlanet)
                embeda.setAuthor(client.user.tag, client.user.displayAvatarURL({ dynamic: true }))
                embeda.setTitle(getPlanet)
                embeda.setImage(getImage)
                message.channel.send(embeda)
                await Server.updateOne({ ServerID: message.guild.id }, { $set: { ServerGameSettings: { Planet: getPlanet, Arc: Guild.ServerGameSettings.Arc } } })

                cooldown.delete(message.guild.id + "s")
            }, 3400);
        })
    } else if (Guild.ServerGameSettings.Planet != "None" && Guild.ServerGameSettings.Arc == "None") { //Arc is None
        client.cooldown.set(message.guild.id + "s")
        let newArc = new modules().chooseNewSaga(Guild.ServerGameSettings.Planet)
        let cacheimage = new modules().getImages(newArc)
        message.channel.send(new MessageEmbed().setTitle("Arc " + newArc).setImage(cacheimage).setAuthor(client.user.tag, client.user.displayAvatarURL({ dynamic: true })))
        await Server.updateOne({ ServerID: message.guild.id }, { $set: { ServerGameSettings: { Planet: Guild.ServerGameSettings.Planet, Arc: newArc } } })
        client.cooldown.delete(message.guild.id + "s")
    } else if (Guild.ServerGameSettings.Planet != "None" && Guild.ServerGameSettings.Arc != "None" && Guild.Mob.Name === "None" && new modules().getMobType(Guild) != "None") { //New Mob which is not none
        let typeofMob = new modules().getMobType(Guild)
        let newMob = new modules().chooseANewMob(Guild.ServerGameSettings.Planet, Guild.ServerGameSettings.Arc, new modules().getMobType(Guild))
        let embed = new MessageEmbed()
        client.cooldown.set(message.guild.id + "s")
        embed.setAuthor(client.user.tag, client.user.displayAvatarURL({ dynamic: true }))
        embed.setTitle(newMob.Name)
        embed.setDescription(`> Health: ${newMob.Health.toLocaleString()} / ${newMob.MaxHealth.toLocaleString()} \n > Stamina: ${newMob.Stamina.toLocaleString()} / ${newMob.MaxStamina.toLocaleString()}`)
        embed.addField('Level', newMob.Level.toLocaleString(), true)
        embed.addField('Exp', newMob.Exp.toLocaleString() + "/" + newMob.MaxExp, true)
        embed.addField('Reward', newMob['Exp Gain'].toLocaleString() + 'Exp', true)
        embed.setThumbnail(newMob.ImageURL)
        return message.channel.send(embed).then(msg => new modules().RunGame(msg, newMob))
    } else if (Guild.ServerGameSettings.Planet != "None" && Guild.ServerGameSettings.Arc != "None" && Guild.Mob.Name != "None" && new modules().getMobType(Guild) != "None") { //get the current mob which is saved.
        let typeofMob = new modules().getMobType(Guild)
        let newMob = Guild.Mob;
        let embed = new MessageEmbed()
        client.cooldown.set(message.guild.id + "s")
        embed.setAuthor(client.user.tag, client.user.displayAvatarURL({ dynamic: true }))
        embed.setTitle(newMob.Name)
        embed.setDescription(`> Health: ${newMob.Health.toLocaleString()} / ${newMob.MaxHealth.toLocaleString()} \n > Stamina: ${newMob.Stamina.toLocaleString()} / ${newMob.MaxStamina.toLocaleString()}`)
        embed.addField('Level', newMob.Level.toLocaleString(), true)
        embed.addField('Exp', newMob.Exp.toLocaleString() + "/" + newMob.MaxExp, true)
        embed.addField('Reward', newMob['Exp Gain'].toLocaleString() + 'Exp', true)
        embed.setThumbnail(newMob.ImageURL)
        message.channel.send(embed).then(msg => new modules().RunGame(msg, newMob))
    } else if (Guild.ServerGameSettings.Planet != "None" && Guild.ServerGameSettings.Arc != "None" && Guild.Mob.Name === "None" && new modules().getMobType(Guild) == "None") {
        message.channel.send("Completed.")
        await Server.updateOne({ ServerID: message.guild.id }, { $set: { ServerGameSettings: { Planet: "None", Arc: "None" }, MobsCount: { NormalMob: 0, SemiMob: 0, Bosses: 0 }, Mob: { Name: "None" } } })
    } else {
        message.channel.send(new MessageEmbed().setAuthor(client.user.tag, client.user.displayAvatarURL({ dynamic: true })).setColor("YELLOW").setTitle("Error").setDescription("something went wrong in the system. Restarting the spawner..."))
        await Server.updateOne({ ServerID: message.guild.id }, { $set: { ServerGameSettings: { Planet: "None", Arc: "None" }, MobsCount: { NormalMob: 0, SemiMob: 0, Bosses: 0 }, Mob: { Name: "None" } } })
    }

}