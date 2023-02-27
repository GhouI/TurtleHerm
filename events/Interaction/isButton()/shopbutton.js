const path = require('path')
module.exports = {
    customId: path.basename(__filename, '.js'),

    async execute(interaction) {
        let ArrayOfElements = []
        for ([key, value] of Object.entries(shop)) {
            for (Item of shop[key]) {
                ArrayOfElements.push({
                    name: Item.Name.toString(),
                    value: Item.Description.toString()
                })
            }
        }


    }
}