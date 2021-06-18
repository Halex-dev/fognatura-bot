const fun = require(`./../lib/function.js`);
const cfg = require("./../config.json");

module.exports = {
    name: 'help',
    description: 'Informazioni sui comandi del bot',
    private: true,
    async execute(client, msg, args){
        const data = [];
        const commands = client.commands;

        if(msg.channel.type !== `dm`)
            msg.delete();

        if(!args.length){
            data.push("```Ecco una lista di tutti i comandi:");
            data.push(commands.map((commands)=> {
                if(!commands.private)
                    return String(`- ${commands.name}\n`);
            }).join(''))
            data.push(`Puoi usare ${cfg.prefix}help [nome comando]\ per informazioni più dettagliate\`\`\``);
        
            return msg.author.send(data, {split: true})
            .then(() => {
                if(msg.channel.type === `dm`) return;
                msg.reply(`La lista dei comandi ti è stata inviata in DM!`);
            })
            .catch(error => {
                console.error(`Impossibile inviare un DM a ${msg.author.tag}`)
                msg.reply(`Impossibile mandarti i comandi in privato, attiva i DM!`);
            });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name);

        if(!command || commands.private)
            return msg.reply("Il comando non esiste!");

        data.push(`\`\`\`Nome comando: ${command.name}`);

        if(command.syntex) data.push(`Descrizione: ${command.syntex}`);
        if(command.description) data.push(`Descrizione: ${command.description}`);

        data.push("\`\`\`");
        msg.channel.send(data, {split: true});
    }
}

