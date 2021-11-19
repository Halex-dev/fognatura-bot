const {MessageEmbed} = require('discord.js');
const {bestemmie} = require(`../data/bestemmie.js`);

const timer = {};

module.exports= {
    /*bestemmie: require(`./bestemmie.js`),
    eventi: require(`./event.js`),*/

    tagPlayer: async function(user) {
        var str = "";

        str += "<@" + user.id + ">";

        return str;
    },

    //Evento della bestemmia, bestemmia casuale su un canale in un range di 3-6 ore
    eventoBestemmia: async function(channel) {
        await this.sendMSG(channel, await this.getBestemmia());
        let random = Math.floor(Math.random() * (14400000 - 3600000) + 3600000);

        console.log("Random dentro:" + random);
        
        if(timer['Bestemmia']){
            clearTimeout(timer['Bestemmia']);
            console.log("Dio cane");
        }

        timer['Bestemmia'] = setTimeout(async function(){
            await this.eventoBestemmia(channel)
        }, random);
    },

    //Funzione per prendere una bestemmia casuale
    getBestemmia: async function() {
        return bestemmie[Math.floor(Math.random()*bestemmie.length)];
    },
  };