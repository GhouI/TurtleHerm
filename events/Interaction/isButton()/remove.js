const path = require('path')

const PlayerModel = require('../../../util/Mongoose/models/Player')
const ServerModel = require('../../../util/Mongoose/models/Server')
module.exports = {
    customId: path.basename(__filename, '.js'),

    async execute(interaction) {
        let Player = interaction.user
        let { PlayerArmor } = await PlayerModel.findOne({ ServerID: interaction.guild.id, UserID: Player.id })
        let suffix = interaction.customId.substring('remove'.length).trim();
        switch (suffix) {
            case 'allarmor':
                PlayerArmor = {
                    'Top': 'None',
                    'Head': 'None',
                    'Bottom': 'None'
                }
                await PlayerModel.updateOne({ ServerID: interaction.guild.id, UserID: Player.id }, {
                    $set: {
                        PlayerArmor: PlayerArmor
                    }
                })
                return interaction.reply("All of your armor has been removed.")
            case 'toparmor':
                PlayerArmor.Top = 'None'
                await PlayerModel.updateOne({ ServerID: interaction.guild.id, UserID: Player.id }, {
                    $set: {
                        PlayerArmor: PlayerArmor
                    }
                })
                return interaction.reply("All of your armor has been removed.")
        }
    }
}