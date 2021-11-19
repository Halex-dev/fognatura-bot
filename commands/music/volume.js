const { MessageEmbed, Message } = require("discord.js");
const embed = require("../../botconfig/embed.json");
const fun = require(`./../../handlers/function.js`);

module.exports = {
    name: 'volume',
    description: 'Comando per far partire una playlist personalizzata o aggiungerla/rimuoverla',
    private: false,
    aliases: ["v", "vol"],
    async execute(client, msg, args){

        const channel = msg.member.voice.channel;
        const guild = msg.guild;
        const member = msg.member;

        if (!channel)
            return await msg.channel.send( await fun.getBestemmia() + ", devi entrare in un canale prima!");

        if (channel.guild.me.voice.channel && channel.guild.me.voice.channel.id != channel.id)
            return await msg.channel.send(await fun.getBestemmia() + ", devi entrare dove sono io prima!");

        if (!args[0])
            return await msg.channel.send(await fun.getBestemmia() + ", sei down?! devi inserire un numero");

        try {
            let newQueue = client.distube.getQueue(guild.id);
            if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) return msg.reply({
                embeds: [
                    new MessageEmbed().setColor(embed.wrongcolor).setTitle(`${client.allEmojis.x} **I am nothing Playing right now!**`)
                ],

            });

            let volume = Number(args[0]);

            if (volume > 150 || volume < 0)
                return await msg.channel.send(await fun.getBestemmia() + ", il numero va da 0 a 150");

            await newQueue.setVolume(volume);
            msg.reply({
                embeds: [new MessageEmbed()
                  .setColor(embed.color)
                  .setTimestamp()
                  .setTitle(`🔊 **Changed the Volume to \`${volume}\`!**`)
                  .setFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))]
            });

        } catch (e) {
            console.log(e.stack ? e.stack : e)
        }
    }
}

