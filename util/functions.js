const { Collection, EmbedBuilder } = require("discord.js");
const { default: mongoose } = require("mongoose");
const UserScheme = require('./Mongoose/models/Player')
const ServerSchema = require('./Mongoose/models/Server.js')
const { earth, namek } = require('./Modules/Game/MobSettings.json')
const ms = require('ms')
let CacheGuilds = new Map()
module.exports = {
    async init(client) {
        setInterval(() => {
            if (CacheGuilds.size > 0) {
                CacheGuilds.clear();
                console.log("CacheGuilds cleared successfully");
            }
        }, ms('3 min'))
    },

    async getCustomChannelId() {
        return 0;
    },
    async connectMD() {
        if (mongoose.connection.readyState != 1) {
            mongoose.connect("mongodb+srv://user123:123@datacluster.od1ssmi.mongodb.net/Servers?retryWrites=true&w=majority", {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                })
                .then(() => console.log('MongoDB Connected'))
                .catch(err => console.error(err));
        }

    },


    async createServerDataFile(guild) {
        let serverfile = await ServerSchema.findOneAndUpdate({ ServerID: guild.id }, {
            ServerID: guild.id,
            GuildName: guild.name,
            Activated: false,
            RegisteredChannel: "None",
            ServerGameSettings: {
                "Planet": "None",
                "Arc": "None"
            },
            MobsCount: {
                "NormalMob": 0,
                "SemiMob": 0,
                "Bosses": 0,
            },
            "Mob": {
                Name: "None"
            },
        }, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
        });
        if (serverfile) {
            console.log("Server file for " + guild.id + " created/updated successfully");
        }
    },

    async DidGuildAlreadyExists(guildId) {
        let Server = await ServerSchema.findOne({ ServerID: guildId })
        if (Server) {
            return true;
        } else {
            return false;
        }
    },
    async getGuildData(GuildID) {
        await this.connectMD();
        if (CacheGuilds.has(GuildID)) return CacheGuilds.get(GuildID);
        let Server = await ServerSchema.findOne({ ServerID: GuildID })
            .lean()
            .exec();
        CacheGuilds.set(GuildID, Server);


        return Server;
    },

    async getUserDocument(GuildID, TheUserID) {
        let user = await UserScheme.findOne({ ServerID: GuildID, UserID: TheUserID });
        return user || null;
    },
    async createTempEmbed(authorname, authorImageURL, embedColor, description) {
        Embed = new EmbedBuilder()
            .setAuthor({
                name: authorname,
                iconURL: authorImageURL
            })
            .setColor(embedColor)
            .setDescription(description)
        return Embed
    }
}