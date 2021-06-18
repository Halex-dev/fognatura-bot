const { eventi } = require("./../lib/function.js");
const fun = require(`./../lib/function.js`);

module.exports = {
    name: 'stop',
    description: 'Comando per far stoppare l\'evento della bestemmia',
    async execute(client, msg, args){

        if(msg.channel.type === `dm`)
            return;
        
        msg.delete();

        if(!eventi['Bestemmia'])
            return await fun.embedError(msg.channel, "Il bot non sta bestemmiando a caso");

        clearTimeout(eventi['Bestemmia']);
        eventi['Bestemmia'] = null;

    }
}
