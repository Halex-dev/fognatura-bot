const { Guild } = require("discord.js")

module.exports = {
    name: 'userUpdate',
    description: 'Funzione per quando un utente fa l\'update del profilo',
    async execute(old, user){

        console.log(old);
        console.log(user);
        if(old.id === "98116160339312640")
            Guild.member(old).setNickname("Dario");

        if(old.id === "520976028609282048")
            Guild.member(old).setNickname("Frankyno");
    }
}