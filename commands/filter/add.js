const { MessageEmbed, Message } = require("discord.js");
const embed = require("../../botconfig/embed.json");
const fun = require(`./../../handlers/function.js`);
const FiltersSettings = require("../../botconfig/filters.json");

module.exports = {
    name: 'addfilter',
    description: 'Comando per aggiungere un filtro alla queue',
    private: false,
    aliases: ["addf"],
    execute: async (client, msg, args) => {

        const channel = msg.member.voice.channel;
        const guild = msg.guild;
        const member = msg.member;

        if (!channel)
            return await msg.channel.send( await fun.getBestemmia() + ", devi entrare in un canale prima!");

        if (channel.guild.me.voice.channel && channel.guild.me.voice.channel.id != channel.id)
            return await msg.channel.send(await fun.getBestemmia() + ", devi entrare dove sono io prima!");

            try {

				let newQueue = client.distube.getQueue(guild.id);
				if (!newQueue || !newQueue.songs || newQueue.songs.length == 0)
					return msg.reply("Non sto riproducendo nulla. " + await fun.getBestemmia());

				let filters = args;
				if (await filters.some(a => !FiltersSettings[a])) {
					return msg.reply({
						embeds: [
							new MessageEmbed()
							.setColor(embed.wrongcolor)
							.setFooter(embed.footertext, embed.footericon)
							.setDescription("**To define Multiple Filters add a SPACE (` `) in between!**")
							.addField("**All Valid Filters:**", Object.keys(FiltersSettings).map(f => `\`${f}\``).join(", ") + "\n\n**Note:**\n> *All filters, starting with custom are having there own Command, please use them to define what custom amount u want!*")
						],
					})
				}
				let amount = filters.length;
				let toAdded = filters;
				//add old filters so that they get removed 	
				await newQueue.filters.forEach((f) => {
					if (!filters.includes(f)) {
						toAdded.push(f)
					}
				})
				if (!toAdded || toAdded.length == 0) {
					return msg.reply({
						embeds: [
							new MessageEmbed()
							.setColor(embed.wrongcolor)
							.setFooter(embed.footertext, embed.footericon)
							.setTitle(`${client.allEmojis.x} **You did not add a Filter, which is (not) in the Filters yet.**`)
							.addField("**All __current__ Filters:**", newQueue.filters.map(f => `\`${f}\``).join(", "))
						],
					})
				}
				newQueue.setFilter(filters);
				msg.reply({
					embeds: [new MessageEmbed()
					  .setColor(embed.color)
					  .setTimestamp()
					  .setTitle(`♨️ **Set ${amount} Filters!**`)
					  .setFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))]
				})
			} catch (e) {
				console.log(e.stack ? e.stack : e);
			}
    }
}

