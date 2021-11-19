const { MessageEmbed, Message } = require("discord.js");
const embed = require("../../botconfig/embed.json");
const fun = require(`./../../handlers/function.js`);

module.exports = {
    name: 'loop',
    description: 'Comando per mettere in pausa una canzone',
    private: false,
    aliases: ["l"],
    execute: async (client, msg, args) => {

        const channel = msg.member.voice.channel;
        const guild = msg.guild;
        const member = msg.member;
        var choose = args[0];

        if (!channel)
            return await msg.channel.send( await fun.getBestemmia() + ", devi entrare in un canale prima!");

        if (channel.guild.me.voice.channel && channel.guild.me.voice.channel.id != channel.id)
            return await msg.channel.send(await fun.getBestemmia() + ", devi entrare dove sono io prima!");

        if (!choose && choose == undefined)
            return await msg.channel.send(await fun.getBestemmia() + ", devi anche inserire una modalità! (0 is disabled, 1 is repeating a song, 2 is repeating all the queue)");

        choose = Number(args[0]);

        if (choose > 2 || choose < 0)
            return await msg.channel.send(await fun.getBestemmia() + ", ci sono solo queste modalità! (0 is disabled, 1 is repeating a song, 2 is repeating all the queue)");

        try {
            let queue = await client.distube.getQueue(guild.id);

            if (!queue || !queue.songs || queue.songs.length == 0) 
                return msg.reply("Non sto riproducendo nulla. " + await fun.getBestemmia());


            await queue.setRepeatMode(choose);

            msg.reply({
                embeds: [new MessageEmbed()
                    .setColor(embed.color)
                    .setTimestamp()
                    .setTitle(`⏹ **Attivata la modalità loop con modalità: ${choose} !**`)
                    .setFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))]
            })

            return;
        } catch (e) {
            console.log(e.stack ? e.stack : e)
        }
    }
}

