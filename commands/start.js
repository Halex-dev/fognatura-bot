const { eventi } = require("./../lib/function.js");
const fun = require(`./../lib/function.js`);

module.exports = {
    name: 'start',
    description: 'Comando per far iniziare un evento di bestemmie nel channel in cui si è',
    async execute(client, msg, args){

        if(msg.channel.type === `dm`)
            return;

        msg.delete();

        if(eventi['Bestemmia'])
            return await fun.embedError(msg.channel, "Il bot sta già bestemmiando a caso");

        let rand = Math.floor(Math.random() * (14400000 - 3600000) + 3600000);
        eventi['Bestemmia'] = setTimeout(async function() {
            await fun.eventoBestemmia(msg.channel)
        }, rand);
    }
}
