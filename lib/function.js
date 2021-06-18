const {MessageEmbed} = require('discord.js');

module.exports= {
    bestemmie: require(`./bestemmie.js`),
    eventi: require(`./event.js`),

    tagPlayer: async function(user) {
        var str = "";

        str += "<@" + user.id + ">";

        return str;
    },

    //Funzione per mandare un messaggio normale.
    sendMSG: async function(channel, txt) {
        await channel.send(txt);
    },

    //Funzione per mandare un messaggio normale taggando l'user.
    sendTagMSG: async function(channel, user, txt) {
            await channel.send( await this.tagPlayer(user) + " "+ txt);
    },

    //Funzione per mandare un messaggio in privata
    sendDM: async function(user, title, txt) {
        await EmbedDM(user, title, txt);
    },

    //Funzione per l'Embed dei messaggi.
    embed: async function(channel, title, description) {
        const embed = new MessageEmbed()
            .setTitle(title)
            .setColor(0xff0000)
            .setDescription(description)
            .setFooter("Created by Halex_");

        //await timer(TIME_MSG);
        await channel.send(embed);
    },

    //Funzione per errore tramite l'Embed dei messaggi.
    embedError: async function(channel, description) {
        const embed = new MessageEmbed()
            .setTitle("Errore")
            .setColor(0xff0000)
            .setDescription(description);
        await channel.send(embed);
    },

    //Funzione per l'Embed dei messaggi in DM.
    embedDM: async function(user, title, description) {
        const embed = new MessageEmbed()
            .setTitle(title)
            .setColor(0xff0000)
            .setDescription(description);
        await user.send(embed);
    },

    //Funzione per errore tramite l'Embed dei messaggi in DM.
    errorDM: async function(user, title, description) {
        const embed = new MessageEmbed()
            .setTitle(title)
            .setColor(0xff0000)
            .setDescription(description);
        await user.send(embed);
    },

    eventoBestemmia: async function(channel) {
        await this.sendMSG(channel, await this.getBestemmia());
        let random = Math.floor(Math.random() * (14400000 - 3600000) + 3600000);

        console.log("Random dentro:" + random);
        
        if(eventi['Bestemmia']){
            clearTimeout(eventi['Bestemmia']);
            console.log("Dio cane");
        }

        eventi['Bestemmia'] = setTimeout(async function(){
            await this.eventoBestemmia(channel)
        }, random);
    },
    getBestemmia: async function() {
        return bestemmie[Math.floor(Math.random()*bestemmie.length)];
    },
    
  };