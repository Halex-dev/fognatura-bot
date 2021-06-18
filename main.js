const fs = require("fs");
const Discord = require("discord.js");

//ConfigFile
const cfg = require("./config.json");

// Extract the required classes from the discord.js module
const { Client, MessageEmbed, Guild } = require('discord.js');

// Create an instance of a Discord client
const client = new Client();
client.commands = new Discord.Collection();
client.event = new Discord.Collection();


//Prendo gli eventi e i comandi e me li salvo
const commandFiles = fs.readdirSync(`./commands`).filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync(`./event`).filter(file => file.endsWith('.js'));

for(const file of commandFiles){
  const command = require(`./commands/${file}`);

  client.commands.set(command.name, command);
}

for(const file of eventFiles){
  const eve = require(`./event/${file}`);

  client.event.set(eve.name, eve);
}

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', reason.stack || reason)
  return;
  });
  

client.on("ready", () => client.event.get("ready").execute(client));

client.on("error", (e) => {
  console.error(e);
});

client.on("warn", (e) => {
console.warn(e);
});

/*client.on("debug", (e) => {
console.info(e);
});*/


client.on("message", msg => {
  if (msg.author.bot) return;

  //Non prendo in considerazione i comandi senza prefisso
  if (!msg.content.startsWith(cfg.prefix)) return;

  const commandBody = msg.content.slice(cfg.prefix.length).trim(); //Prendo il testo senza il prefix e tolgo spazi alla fine in più
  const args = commandBody.split(' '); //splitto il comando e tutti gli argomenti (se ci sono)
  const command = args.shift().toLowerCase(); //prendo solo il comando

  if(!client.commands.has(command)) return;

  try{client.commands.get(command).execute(client, msg, args)
  }
  catch (e){
    console.error(e);
  }
  
});

client.on("userUpdate", (oldUser, newUser) => { console.log("user de merds")
}
);

client.on("voiceStateUpdate", (oldUser, newUser) => {
    try{client.event.get("voiceStateUpdate").execute(oldUser, newUser)
    }
    catch (e){
      console.error(e);
    }
  }
);

client.on('presenceUpdate', (oldPresence, newPresence) => {

  try{client.event.get("presenceUpdate").execute(oldPresence, newPresence)
  }
  catch (e){
    console.error(e);
  }
 
});

client.login(cfg.TOKEN);