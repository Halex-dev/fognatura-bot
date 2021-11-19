const fun = require(`./../../handlers/function.js`);
const {MessageEmbed} = require(`discord.js`);

module.exports = {
    name: 'play',
    description: 'Comando per mettere in lista una canzone',
    private: false,
    aliases: ["p"],
    execute: async (client, msg, args) => {

        const channel = msg.member.voice.channel;
        const songSearch = await args.join(' ');
        const guild = msg.member.guild;
        const member = msg.member;
        
        if (!channel)
            return await msg.channel.send( await fun.getBestemmia() + ", devi entrare in un canale prima!");

        const permissions = channel.permissionsFor(msg.client.user);

        if (!permissions.has("CONNECT") || !permissions.has("SPEAK"))
            return await msg.channel.send(await fun.getBestemmia() +  ", ho bisogno dei permessi per parlare o entrare!");

        if (!songSearch && songSearch == undefined)
            return await msg.channel.send(await fun.getBestemmia() + ", devi inserire un url o un nome di una canzone!");


        let newmsg = await msg.reply({
            content: `🔍 Searching... \`\`\`${songSearch}\`\`\``,
            ephemeral: true
        });

        try {
            let queue = client.distube.getQueue(guild.id);
            let options = {
                member: member,
            }

            if (!queue) 
                options.textChannel = guild.channels.cache.get(msg.channelId);

            await client.distube.playVoiceChannel(channel, songSearch, options).then(() => {
                newmsg.delete();
                
            }).catch(e => {
                newmsg.edit({
                    content: `${queue?.songs?.length > 0 ? "Errore, non aggiunta" : "Errore, non aggiunta"}: \`\`\`css\n${songSearch}\n\`\`\``,
                    ephemeral: true
                });
                console.log(e);
            })

            
        } catch (e) {
            console.log(e.stack ? e.stack : e)
        }
        
        msg.delete();
    }
}

