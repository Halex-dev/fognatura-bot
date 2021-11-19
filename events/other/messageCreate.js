const cfg = require("./../../botconfig/config.json");

module.exports = async (client, message) => {

    if (message.author.bot) return;

    //Non prendo in considerazione i comandi senza prefisso
    if (await !message.content.startsWith(cfg.prefix)) return;
  
    const commandBody = await message.content.slice(cfg.prefix.length).trim(); //Prendo il testo senza il prefix e tolgo spazi alla fine in più
    const args = await commandBody.split(' '); //splitto il comando e tutti gli argomenti (se ci sono)
    const command = await args.shift().toLowerCase(); //prendo solo il comando

    try{
      let cmd = client.commands.get(command);

      if(!cmd) 
        cmd = client.commands.get(client.aliases.get(command));

      if(cmd)
        await cmd.execute(client, message, args);
    }
    catch (e){
      console.error(e);
    }
  
};