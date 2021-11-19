const cfg = require("../../botconfig/config.json");

module.exports = {
    name: 'help',
    description: 'Informazioni sui comandi del bot',
    private: true,
    execute: async (client, msg, args) => {
        const data = [];
        const commands = client.commands;

        if(!args.length){
            await data.push("```Ecco una lista di tutti i comandi:\n");
            await data.push(commands.map((commands)=> {
                if(!commands.private)
                    return String(`- ${commands.name}\n`);
            }).join(''));
            await data.push(`Puoi usare ${cfg.prefix}help [nome comando]\ per informazioni più dettagliate\`\`\``);
        
            return await msg.channel.send(data.join(''), {split: true})
                .then(() => {})
                .catch(error => {
                    console.error(`Impossibile inviare un DM a ${msg.author.tag}`)
                    //console.error(error);
                });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name);

        if(!command || commands.private)
            return msg.reply("Il comando non esiste!");

        data.push(`\`\`\`Nome comando: ${command.name}\n`);

        if(command.syntex) data.push(`Sintassi: ${command.syntex}\n`);
        if(command.description) data.push(`Descrizione: ${command.description}\n`);

        data.push("\`\`\`");
        msg.channel.send(data.join(''), {split: true});
    }
}
