
/**
 *  _____________________________________________________
 *  |                                                   |
 *  |                                            
 *  |                                                   |
 *  |___________________________________________________|
 */

const fs = require("fs");
const Discord = require("discord.js");
const DisTube = require("distube").default;
const cfg = require("./botconfig/config.json");
const filters = require(`./botconfig/filters.json`);
const Enmap = require("enmap");

const client = new Discord.Client({
  //fetchAllMembers: false,
  //restTimeOffset: 0,
  //restWsBridgetimeout: 100,
  shards: "auto",
  //shardCount: 5,
  /*allowedMentions: {
    parse: [ ],
    repliedUser: false,
  },*/
  //partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
  intents: [ 
      Discord.Intents.FLAGS.GUILDS,
      //Discord.Intents.FLAGS.GUILD_MEMBERS,
      Discord.Intents.FLAGS.GUILD_MESSAGES,
      Discord.Intents.FLAGS.GUILD_VOICE_STATES,
      //Discord.Intents.FLAGS.GUILD_BANS,
      //Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
      //Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
      //Discord.Intents.FLAGS.GUILD_WEBHOOKS,
      //Discord.Intents.FLAGS.GUILD_INVITES,
      //Discord.Intents.FLAGS.GUILD_PRESENCES,
      //Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
      //Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
      //Discord.Intents.FLAGS.DIRECT_MESSAGES,
      //Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
      //Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING
  ],
  presence: {
    status: 'online',
    activity: {
      name: 'La crocifissione di Gesù',
      type: 'WATCHING'
    },
  }
});

//Personal Music player
client.distube = new DisTube(client, {
  emitNewSongOnly: false,
  leaveOnEmpty: true,
  leaveOnFinish: true,
  leaveOnStop: true,
  savePreviousSongs: true,
  emitAddSongWhenCreatingQueue: false,
  //emitAddListWhenCreatingQueue: false,
  searchSongs: 0,
  youtubeCookie: cfg.youtubeCookie,     //Comment this line if you dont want to use a youtube Cookie 
  nsfw: true, //Set it to false if u want to disable nsfw songs
  emptyCooldown: 25,
  ytdlOptions: {
    //requestOptions: {
    //  agent //ONLY USE ONE IF YOU KNOW WHAT YOU DO!
    //},
    highWaterMark: 1024 * 1024 * 64,
    quality: "highestaudio",
    format: "audioonly",
    liveBuffer: 60000,
    dlChunkSize: 1024 * 1024 * 64,
  },
  youtubeDL: true,
  updateYouTubeDL: true,
  customFilters: filters,
  plugins: [
    //new SpotifyPlugin(spotifyoptions),
    //new SoundCloudPlugin()
  ]
})

//Define some Global Collections
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();
client.slashCommands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.categories = require("fs").readdirSync(`./commands`);
client.allEmojis = require("./botconfig/emojis.json");

client.setMaxListeners(100); require('events').defaultMaxListeners = 100;

client.settings = new Enmap({ name: "settings",dataDir: "./databases/settings"});

["events", "commands", cfg.antiCrash ? "antiCrash" : null, "distubeEvent"]
    .filter(Boolean)
    .forEach(h => {
        require(`./handlers/${h}`)(client);
});


client.login(cfg.TOKEN);