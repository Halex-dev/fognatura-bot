module.exports = {
    name: 'kick',
    description: 'Comando per far iniziare un evento di bestemmie nel channel in cui si è',
    private: true,
    async execute(client, msg, args){

        const author = msg.author;
        const target = msg.mentions.members.first();

        if(msg.channel.type != `dm`)
            msg.delete();
        else{
            console.log("Da fare");
        }

        if(author.id != 176791820171345922n)
            return;

        if(!target)
            return;

        if(!msg.guild.members.cache.get(target.id).voice.channel)
            return;

        target.voice.kick();
    }
}
