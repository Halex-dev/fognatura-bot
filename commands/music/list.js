const { MessageEmbed, Message } = require("discord.js");
const embed = require("../../botconfig/embed.json");
const fun = require(`./../../handlers/function.js`);

module.exports = {
    name: 'list',
    description: 'Comando per skippare la canzone',
    private: false,
    async execute(client, msg, args){

        const channel = msg.member.voice.channel;
        const guild = msg.guild;
        const member = msg.member;
        
        if (!channel)
            return await msg.channel.send( await fun.getBestemmia() + ", devi entrare in un canale prima!");

        const permissions = channel.permissionsFor(msg.client.user);

        if (!permissions.has("CONNECT") || !permissions.has("SPEAK"))
            return await msg.channel.send(await fun.getBestemmia() +  ", ho bisogno dei permessi per parlare o entrare!");

        if (channel.guild.me.voice.channel && channel.guild.me.voice.channel.id != channel.id)
            return await msg.channel.send(await fun.getBestemmia() + ", devi entrare dove sono io prima!");

        try {
            let newQueue = await client.distube.getQueue(guild.id);

            if (!newQueue || !newQueue.songs || newQueue.songs.length == 0)
                return msg.reply("Non sto riproducendo nulla. " + await fun.getBestemmia());
                

            if(newQueue.songs.length == 1){
                
                if(newQueue.playing)
                    newQueue.pause();
                    
                newQueue.songs = [];

                msg.reply({
                    embeds: [new MessageEmbed()
                      .setColor(embed.color)
                      .setTimestamp()
                      .setTitle(`⏭ **Skipped the Song!**`)
                      .setFooter(`${client.allEmojis.right} Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))]
                })
            }
            else{
                await newQueue.skip();

                msg.reply({
                    embeds: [new MessageEmbed()
                      .setColor(embed.color)
                      .setTimestamp()
                      .setTitle(`⏭ **Skipped to the next Song!**`)
                      .setFooter(`${client.allEmojis.right} Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))]
                })
            }
                   
        } catch (e) {
            console.log(e.stack ? e.stack : e)
        }
    }
}

