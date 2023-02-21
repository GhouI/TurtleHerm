const Player = require('../../../Mongoose/models/Player');
const ItemList = require('./ItemsList.json')
module.exports = class Item {
    constructor(ItemID) {
        if (ItemID == null) return console.error("ItemID is not valid.");
        for (const [CategoryName, itemCategory] of Object.entries(ItemList)) {
            for (const item of itemCategory) {
                if (item.ItemId === JSON.stringify(ItemID)) {
                    this.Item = item;
                    this.ItemCategory = CategoryName
                }
            }
        }

    }
    getItemProperty(Property) {
        let Item = this.Item
        if (Item == null) return "Can't find the item."
        switch (Property) {
            case 'Name':
                return Item.Name;
            case 'ItemId':
                return Item.ItemId
            case 'Rarity':
                return Item.Rarity;
            case 'Cost':
                return Item.Cost;
            case 'Description':
                return Item.Description;
            case 'Effect':
                return Item.Effect;
            case "ItemType":
                return this.ItemCategory
            default:
                return null;
        }
    }
    async use({ ServerID, UserID, PlayerArmor }) {
        try {
            // Find the player document
            let player = await Player.findOne({ ServerID: ServerID, UserID: UserID });
            console.log(this.ItemCategory + player)
            switch (this.ItemCategory) {
                case "Healing":
                    // If the item category is Healing, update the player's health
                    const effect = this.getItemProperty('Effect');
                    const newHealth = Math.min(player.PlayerHealth.MaxHealth, player.PlayerHealth.Health + effect);
                    player.PlayerHealth.Health = newHealth;
                    await player.save();
                    return "Updated Player Health";

                case "Armor":
                    const { ArmorType, EffectType, EffectValue } = this.getItemProperty('Effect');

                    if (PlayerArmor[ArmorType] !== "None" && PlayerArmor[ArmorType].ItemId != this.getItemProperty('ItemId')) {
                        // If the player has already equipped armor of this type, return an error message
                        return "User has already equipped armor. They need to take it off";
                    } else if (PlayerArmor[ArmorType].ItemId === this.getItemProperty('ItemId')) {
                        // If the player is trying to remove the armor they are already wearing, remove it and update their health
                        player.PlayerArmor[ArmorType] = "None";
                        player.PlayerHealth[EffectType] = Math.max(1, player.PlayerHealth[EffectType] - EffectValue);
                        if (EffectType == 'Health') {
                            player.PlayerHealth.MaxHealth = Math.max(1, player.PlayerHealth[EffectType] - EffectValue);
                        }
                        await Player.updateOne({ ServerID, UserID }, {
                            $set: {
                                PlayerArmor: player.PlayerArmor,
                                PlayerHealth: player.PlayerHealth
                            }
                        })
                        return `Removed Item ${this.getItemProperty('Name')}`;
                    } else {
                        // Equip the new armor and update the player's health and max health accordingly
                        player.PlayerArmor[ArmorType] = this.Item;
                        player.PlayerHealth[EffectType] = player.PlayerHealth[EffectType] + EffectValue;
                        if (EffectType === "Health") {
                            player.PlayerHealth.MaxHealth += EffectValue;
                        }
                        await Player.updateOne({ ServerID, UserID }, {
                            $set: {
                                PlayerArmor: player.PlayerArmor,
                                PlayerHealth: player.PlayerHealth
                            }
                        })
                        return `Equipped Item ${this.getItemProperty('Name')}`;
                    }

                default:
                    return "Null";
            }
        } catch (error) {
            console.error(error);
            return "Error occurred while updating player document";
        }
    }

    sell() {
        // Sell the item and return the sell price
        // Example: sell the item for 50 gold coins
        return 50;
    }

    describe() {
        // Return a description of the item
        // Example: "A health potion that restores 20 health."
        return `${this.name}: ${this.description}`;
    }
}