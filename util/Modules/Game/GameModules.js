const { earth, namek } = require('./MobSettings.json')
const Player = require('../../Mongoose/models/Player')
const Server = require('../../Mongoose/models/Server')
const Mongoose = require('mongoose')
const Attacksa = require('./Attacks.json')
const { Ki, Physical, Weapons } = require('./Attacks.json')
const imageUrls = {
    earth: "https://i.imgur.com/osPaSyl.png",
    namek: "https://i.imgur.com/qaZlEVm.png",
    saiyan: "https://i.imgur.com/pVYDrlz.png",
    android: "https://i.imgur.com/av5U7Ae.jpg",
    cellsaga: "https://images-na.ssl-images-amazon.com/images/I/51cSvSW+tOL._SY344_BO1,204,203,200_.jpg",
    majinbuu: "https://www.kanzenshuu.com/guides/manga/full_color/majin_buu03-lg.png",
    kidbuu: "https://www.kanzenshuu.com/guides/manga/full_color/majin_buu04-lg.png?x79010",
    ginyuu: "https://i.imgur.com/M98HsqF.png",
    frieza: "https://i.imgur.com/buCkRCC.jpg",
    random: "https://cdn.discordapp.com/attachments/502115221532311592/728705601659732039/SPOILER_planet.gif"
};
Array.prototype.sample = function() {
    return this[Math.floor(Math.random() * this.length)];
}
module.exports = {
    async chooseNewPlanet() {
        const planets = ["Earth", "Namek"]; // Array of planet names
        const ChoosePlanet = Math.round(Math.random()); // Round random number to 0 or 1
        return planets[ChoosePlanet]; // Return the planet at the index indicated by ChoosePlanet
    },
    async getValidAttacks(Attacks) {
        let ListOfAttacks = [];
        for (const key in Attacks) {
            const Attack = Attacks[key];
            if (Attack !== "None") {
                ListOfAttacks.push({
                    label: Attack.Name,
                    description: Attack.Description,
                    value: Attack.Name
                });
            }
        }
        return ListOfAttacks;
    },


    async checkPlayerStatus(Health, Stamina) {
        if (Health <= 0) {
            return "Health";
        } else if (Stamina <= 0) {
            return "Stamina";
        } else {
            return true;
        }
    },
    async doesAttackExist(attackName) {
        for (const key in Attacksa) {
            const category = Attacksa[key];
            for (let i = 0; i < category.ListOfAttacks.length; i++) {
                if (category.ListOfAttacks[i].Name === attackName) {
                    return true;
                }
            }
        }
        return false;
    },

    async getAttack(attackName) {
        for (const key in Attacksa) {
            const category = Attacksa[key];
            for (let i = 0; i < category.ListOfAttacks.length; i++) {
                if (category.ListOfAttacks[i].Name === attackName) {
                    return category.ListOfAttacks[i];
                }
            }
        }
        return false;
    },
    async ChooseRandomMove(ArrayMoveList, MobStamina) {
        if (ArrayMoveList.length === 0) {
            return null;
        }

        let selectedMove = ArrayMoveList[Math.floor(Math.random() * ArrayMoveList.length)];
        if (selectedMove.StaminaUse <= MobStamina) {
            return selectedMove;
        }

        let remainingMoves = ArrayMoveList.filter(move => move > MobStamina);
        return await ChooseRandomMove(remainingMoves, MobStamina);
    },
    chooseNewSaga(planetName) {
        const sagas = {
            earth: earth.AllSagaNames,
            namek: namek.AllSagaNames
        };
        // Normalize the planet name to lowercase
        planetName = planetName.toLowerCase();
        // Get the list of sagas for the specified planet
        const sagasList = sagas[planetName];
        // Return a default value if the planet name is invalid or the sagas list is empty
        if (!sagasList || sagasList.length === 0) {
            return "Invalid planet name or no sagas available";
        }
        // Return a randomly chosen saga from the list
        return sagasList.sample();
    },
    chooseANewMob(Planet, Saga, MobType) {
        const sagas = {
            earth: {
                saiyan: earth.Sagas.Saiyan.MobData[MobType],
                android: earth.Sagas.Android.MobData[MobType],
                majinbuu: earth.Sagas.MajinBuu.MobData[MobType],
                cellsaga: earth.Sagas.CellSaga.MobData[MobType]
            },
            namek: {
                ginyuu: namek.Sagas.Ginyuu.MobData[MobType],
                frieza: namek.Sagas.Frieza.MobData[MobType]
            }
        };
        // Normalize the planet and saga names to lowercase
        Planet = Planet.toLowerCase();
        Saga = Saga.toLowerCase();
        // Get the saga data for the specified planet and saga
        const sagaData = sagas[Planet][Saga];
        // Return a default value if the planet or saga is invalid or the saga data is empty
        if (!sagaData || sagaData.length === 0) {
            return "Invalid planet or saga name or no mob data available";
        }
        // Return a randomly chosen mob from the saga data
        return sagaData[Math.floor(Math.random() * sagaData.length)];
    },
    determineFasterPlayer(speed1, speed2) {
        // Return true if the first player's speed is greater than the second player's speed
        // Return false otherwise
        if (speed1 > speed2) {
            return true;
        } else {
            return false;
        }
    },
    getImageUrl(arg) {
        // Normalize the argument to lowercase
        arg = arg.toLowerCase();
        // Return the image URL for the specified argument, or a default value if the argument is not found
        return imageUrls[arg] || "https://hotemoji.com/images/dl/1/question-mark-emoji-by-twitter.png";
    },
    async PlayersAttacks(serverid, userId) {
        let { PlayerMoveSet } = await Player.findOne({ ServerID: serverid, UserID: userId })
        return PlayerMoveSet
    },
    getMobType(MongoDocument) {
        const getSagaInfo = (Planet, Saga) => {

                // Normalize the planet and saga names to lowercase
                Planet = Planet.toLowerCase();
                // Select the appropriate saga data based on the planet name
                let sagaData;
                switch (Planet) {
                    case "earth":
                        sagaData = earth.Sagas[Saga];
                        break;
                    case "namek":
                        sagaData = namek.Sagas[Saga];
                        break;
                    default:
                        return;
                }
                // Return the saga data
                return sagaData;
            }
            // Get the current mob counts and saga data
        const { NormalMob, SemiMob, Bosses } = MongoDocument.MobsCount;
        const { MaxMobs, MaxSemiBosses, MaxBosses } = getSagaInfo(MongoDocument.ServerGameSettings.Planet, MongoDocument.ServerGameSettings.Arc);
        // Create an array of mob types that can be spawned
        const availableTypes = [];
        if (NormalMob < MaxMobs) {
            availableTypes.push("NormalMob");
        }
        if (SemiMob < MaxSemiBosses) {
            availableTypes.push("SemiMob");
        }
        if (Bosses < MaxBosses) {
            availableTypes.push("Bosses");
        }
        // Return the first available mob type, or "None" if no types are available
        return availableTypes[0] || "None";
    },
    async RunGame(message, mob) {
        let { Name, Description, Health, MaxHealth, Stamina, MaxStamina, Moves, Level, Exp, ImageURL, BaseDamage } = mob
        const reactions = ['1️⃣', '2️⃣', '3️⃣', '4️⃣'];
        Promise.all(reactions.map(r => message.react(r))).catch(() => console.log("One of the emojis did not work."));
        const filter = (reaction, user) => reactions.includes(reaction.emoji.name);
        let PlrsAttacked = new Map();
        let BattleDamage = 0;
        let MobsAttack = Moves[Math.floor(Math.random() * Moves.length)].Damage + Moves.BaseDamage
        let MessageCollector = message.createReactionCollector(filter, {
            time: 30000
        });









    },
    async addExp(serverId, userId, exp) {
        const player = await Player.findOneAndUpdate({ ServerID: serverId, UserID: userId }, { $inc: { Exp: exp } }, { returnNewDocument: true });

        if (!player) {
            throw new Error(`Player with server ID ${serverId} and user ID ${userId} not found.`);
        }

        function checkLevel(details) {
            if (details.Exp > details.MaxExp) {
                details.Exp = Math.floor(0 + (details.Exp - details.MaxExp));
                details.Level += 1;
                details.MaxExp = Math.floor(details.MaxExp * 1.05);
                details.PlayerHealth.MaxHealth = Math.floor(details.PlayerHealth.MaxHealth * 1.3);
                details.PlayerHealth.Health = Math.floor(details.PlayerHealth.MaxHealth);
                details.PlayerHealth.MaxStamina = Math.floor(details.PlayerHealth.MaxStamina * 1.3);
                details.PlayerHealth.MaxKi = Math.floor(details.PlayerHealth.MaxKi * 1.3);
                details.PlayerHealth.Ki = Math.floor(details.PlayerHealth.MaxKi);
                details.PlayerStats.RP += 5;
                details.Zeni += 2500;
            } else if (details.Exp === details.MaxExp) {
                details.Level += 1;
                details.Exp = 0;
                details.MaxExp = Math.floor(details.MaxExp * 1.05);
                details.PlayerHealth.MaxHealth = Math.floor(details.PlayerHealth.MaxHealth * 1.3);
                details.PlayerHealth.Health = Math.floor(details.PlayerHealth.MaxHealth);
                details.PlayerHealth.MaxStamina = Math.floor(details.PlayerHealth.MaxStamina * 1.3);
                details.PlayerHealth.MaxKi = Math.floor(details.PlayerHealth.MaxKi * 1.3);
                details.PlayerHealth.Ki = Math.floor(details.PlayerHealth.MaxKi);
                details.PlayerStats.RP += 5;
                details.Zeni += 2500;
            }
        }

        let tries = 0;
        while (player.Exp > player.MaxExp || player.Exp === player.MaxExp) {
            checkLevel(player);
            tries += 1;
            if (player.Exp < player.MaxExp) {
                console.log(
                    `Stopping the exp system with ${tries} tries. {ID:${player.UserID},GID:${player.ServerID}}`
                );
                break;
            }
        }
    },

    async AttackExists(name) {
        for (const category of[Ki, Physical, Weapons]) {
            for (const attack of category.ListOfAttacks) {
                if (attack.name.toLowerCase() === name.toLowerCase()) {
                    return true;
                }
            }
        }
        return false;
    },

    async FindAttack(name) {
        const lowerCaseName = name.toLowerCase();
        for (const category of[Ki, Physical, Weapons]) {
            const attack = category.ListOfAttacks.find((a) => a.name.toLowerCase() === lowerCaseName);
            if (attack) {
                return attack;
            }
        }
        return null;
    },





}