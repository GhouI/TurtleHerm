const path = require('path')
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

const PlayerModel = require('../../../util/Mongoose/models/Player')
const Item = require('../../../util/Modules/Game/Items/Items')
module.exports = {
    customId: path.basename(__filename, '.js'),

    async execute(interaction) {
        let Player = interaction.user
        let { PlayerHealth, PlayerArmor } = await PlayerModel.findOne({ ServerID: interaction.guild.id, UserID: Player.id })
        let suffix = interaction.customId.substring('remove'.length).trim();
        switch (suffix) {
            case 'allarmor':
                const ItemCheck = [
                    await new Item(PlayerArmor.Top.ItemId),
                    await new Item(PlayerArmor.Head.ItemId),
                    await new Item(PlayerArmor.Bottom.ItemId)
                ];
                for (const item of ItemCheck) {
                    const getEffect = await item.getItemProperty('Effect')
                    if (getEffect.EffectType('Health')) {
                        const EffectValue = getEffect.EffectValue
                        PlayerHealth.Health = Math.max(1, PlayerHealth.Health - EffectValue);
                        PlayerHealth.MaxHealth = Math.max(1, PlayerHealth.MaxHealth - EffectValue);
                    }
                }
                PlayerArmor = {
                    'Top': 'None',
                    'Head': 'None',
                    'Bottom': 'None'
                }
                await PlayerModel.updateOne({ ServerID: interaction.guild.id, UserID: Player.id }, {
                    $set: {
                        PlayerArmor: PlayerArmor,
                        PlayerHealth: PlayerHealth
                    }
                })
                return interaction.reply("All of your armor has been removed.")
            case 'toparmor':
                let TopArmor = await new Item(PlayerArmor.Top.ItemId)
                let getArmorEffectType = await TopArmor.getItemProperty('Effect').EffectType
                if (getArmorEffectType == 'Health') {
                    const EffectValue = getArmorEffectType.EffectValue
                    PlayerHealth.Health = Math.max(1, PlayerHealth.Health - EffectValue);
                    PlayerHealth.MaxHealth = Math.max(1, PlayerHealth.MaxHealth - EffectValue);
                }
                PlayerArmor.Top = 'None'
                await PlayerModel.updateOne({ ServerID: interaction.guild.id, UserID: Player.id }, {
                    $set: {
                        PlayerArmor: PlayerArmor,
                        PlayerHealth: PlayerHealth
                    }
                })
                return interaction.reply("All of your Top armor has been removed.")
            case 'bottomarmor':
                let BottomArmor = new Item(PlayerArmor.Bottom.ItemId)
                let getArmorEffectTypes = await BottomArmor.getItemProperty('Effect').EffectType
                if (getArmorEffectTypes == 'Health') {
                    const EffectValue = getArmorEffectTypes.EffectValue
                    PlayerHealth.Health = Math.max(1, PlayerHealth.Health - EffectValue);
                    PlayerHealth.MaxHealth = Math.max(1, PlayerHealth.MaxHealth - EffectValue);
                }
                PlayerArmor.Bottom = 'None'
                await PlayerModel.updateOne({ ServerID: interaction.guild.id, UserID: Player.id }, {
                    $set: {
                        PlayerArmor: PlayerArmor,
                        PlayerHealth: PlayerHealth
                    }
                })
                return interaction.reply("All of your Top armor has been removed.")
            case 'headarmor':
                let HeadArmor = new Item(PlayerArmor.Bottom.ItemId)
                let getHeadArmor = await HeadArmor.getItemProperty('Effect').EffectType
                if (getArmorEffectTypes == 'Health') {
                    const EffectValue = getHeadArmor.EffectValue
                    PlayerHealth.Health = Math.max(1, PlayerHealth.Health - EffectValue);
                    PlayerHealth.MaxHealth = Math.max(1, PlayerHealth.MaxHealth - EffectValue);
                }
                PlayerArmor.Head = 'None'
                await PlayerModel.updateOne({ ServerID: interaction.guild.id, UserID: Player.id }, {
                    $set: {
                        PlayerArmor: PlayerArmor,
                        PlayerHealth: PlayerHealth
                    }
                })
                return interaction.reply("All of your Head armor has been removed.")
        }
    }
}