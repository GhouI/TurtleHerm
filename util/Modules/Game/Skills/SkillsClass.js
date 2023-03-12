const Skills = require('../Attacks.json')
const PlayerModel = require('../../../Mongoose/models/Player')
module.exports = class Skill {
    constructor(ItemID) {
        if (!ItemID) {
            console.error("ItemID is not valid.");
            return;
        }

        for (const [key, skillCategory] of Object.entries(Skills)) {
            const matchingSkill = skillCategory.ListOfAttacks.find(skill => skill.ItemID === ItemID);
            if (matchingSkill) {
                this.Skill = matchingSkill;
                this.SkillCategory = skillCategory;
                return;
            }
        }

        this.Skill = null;
        console.error(`Skill with ItemID '${ItemID}' not found.`);
    }

    getSkillProperty(Property) {
        if (!this.Skill) {
            return null;
        }
        let Propertys = Property.toLowerCase()
        switch (Propertys) {
            case "name":
                return this.Skill.Name;
            case "description":
                return this.Skill.Description;
            case "itemid":
                return this.Skill.ItemID;
            case "damage":
                return this.Skill.Damage.toString();
            case "staminacost":
                return this.Skill.StaminaCost.toString();
            case "cost":
                return this.Skill.Cost.toString();
            case "accurayrate":
                return this.Skill.AccurayRate.toString();
            case "movetype":
                return this.Skill.MoveType;
            case "statsrequired":
                return this.Skill.StatsRequired;
            default:
                return null;
        }
    }

    async equip({ ServerID, UserID }, Slot) {
        function UserPlayerMoveSetAlreadyEquipped(Moveset, ItemID) {
            for (const [key, value] of Object.entries(Moveset)) {
                if (value.ItemID === ItemID) {
                    return true;
                }
            }
            return false;

        }

        if (this.Skill == null) return "Unable to find item"
        let { PlayerMoveSet } = await PlayerModel.findOne({ ServerID: ServerID, UserID: UserID })
        try {
            let OldSkill = PlayerMoveSet[Slot]
            let CheckUserHasSkillFunction = await UserPlayerMoveSetAlreadyEquipped(PlayerMoveSet, this.Skill.ItemID);
            if (CheckUserHasSkillFunction == true) {
                return false;
            }
            if (PlayerMoveSet[Slot] != "None") {
                PlayerMoveSet[Slot] = this.Skill
                await PlayerModel.updateOne({ ServerID: ServerID, UserID: UserID }, {
                    $set: {
                        PlayerMoveSet: PlayerMoveSet
                    }
                })
                return `Updated Moveset Move from ${OldSkill.Name} to ${this.getSkillProperty('name')}`
            } else {
                let CheckUserHasSkillFunction = await UserPlayerMoveSetAlreadyEquipped(PlayerMoveSet, this.Skill.ItemID);
                if (CheckUserHasSkillFunction == true) {
                    return false;
                }
                PlayerMoveSet[Slot] = this.Skill
                await PlayerModel.updateOne({ ServerID: ServerID, UserID: UserID }, {
                    $set: {
                        PlayerMoveSet: PlayerMoveSet
                    }
                })
                return `Updated Skill to ${this.Skill.Name}`
            }
        } catch (e) {
            console.error(e)
        }
    }
    async CheckUserHasSkill(PlayerDoc) {
        let findMove = PlayerDoc.PlayerInventoryMoves.find((val) => val.ItemID == this.Skill.ItemID)
        if (findMove) {
            return true
        } else {
            return false
        }
    }
    async UserPlayerMoveSetAlreadyEquipped(Moveset, ItemID) {
        for (const [key, value] of Object.entries(obj)) {
            if (value.ItemID === ItemID) {
                return true;
            }
        }
        return false;

    }

}