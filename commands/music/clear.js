const { MessageEmbed, Message } = require("discord.js");
const embed = require("../../botconfig/embed.json");
const fun = require(`./../../handlers/function.js`);

module.exports = {
    name: 'clear',
    description: 'Comando per mettere in pausa una canzone',
    private: false,
    aliases: ["c"],
    execute: async (client, msg, args) => {

        const channel = msg.member.voice.channel;
        const guild = msg.guild;
        const member = msg.member;
        
        if (!channel)
            return await msg.channel.send( await fun.getBestemmia() + ", devi entrare in un canale prima!");

        if (channel.guild.me.voice.channel && channel.guild.me.voice.channel.id != channel.id)
            return await msg.channel.send(await fun.getBestemmia() + ", devi entrare dove sono io prima!");

        try {
            let queue = await client.distube.getQueue(guild.id);

            if (!queue || !queue.songs || queue.songs.length == 0) 
                return msg.reply("Non sto riproducendo nulla. " + await fun.getBestemmia());

            const tmp = queue.songs[0];
            queue.songs = [];
            queue.songs[0] = tmp;

            msg.reply({
                embeds: [new MessageEmbed()
                    .setColor(embed.color)
                    .setTimestamp()
                    .setTitle(`⏹ **Cleared queue!**`)
                    .setFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))]
            })

            return;
        } catch (e) {
            console.log(e.stack ? e.stack : e)
        }
    }
}

