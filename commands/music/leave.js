const { MessageEmbed, Message } = require("discord.js");
const embed = require("../../botconfig/embed.json");
const fun = require(`../../handlers/function.js`);

module.exports = {
    name: 'leave',
    description: 'Comando per stoppare il bot',
    private: false,
    async execute(client, msg, args){

        const channel = msg.member.voice.channel;
        const guild = msg.guild;
        const member = msg.member;
        
        if (!channel)
            return await msg.channel.send( await fun.getBestemmia() + ", devi entrare in un canale prima!");


        if (channel.guild.me.voice.channel && channel.guild.me.voice.channel.id != channel.id)
            return await msg.channel.send(await fun.getBestemmia() + ", devi entrare dove sono io prima!");

        try {
            let newQueue = await client.distube.getQueue(guild.id);

            await newQueue.stop();
            msg.reply({
                embeds: [new MessageEmbed()
                  .setColor(embed.color)
                  .setTimestamp()
                  .setTitle(`⏹ **Left the Channel!**`)
                  .setFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))]
            })

            return;
        } catch (e) {
            console.log(e.stack ? e.stack : e)
        }
    }
}

