const fun = require(`./../lib/function.js`);

module.exports = {
    name: 'bestemmia',
    description: 'Comando per far dire una bestemmia al bot',
    async execute(client, msg, args){
        
        if(msg.channel.type === `dm`)
            return;

        msg.delete();
        await fun.sendTagMSG(msg.channel, msg.author, await fun.getBestemmia());
    }
}

