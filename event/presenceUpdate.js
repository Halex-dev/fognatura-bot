const fun = require(`./../lib/function.js`);

module.exports = {
    name: 'presenceUpdate',
    description: 'Evento di quando un utente cambia stato',
    async execute(oldPresence, newPresence){

        if (newPresence.user.bot) return;

        if(newPresence.status === "dnd" && oldPresence.status != "dnd")
            newPresence.user.send(`Cazzo ti metti occupato ${await fun.getBestemmia()}`);
    
        newPresence.activities.map((activity)=> {
            if(activity.type === "PLAYING"){
                newPresence.user.send(`Immagina giocare a ${activity.name} nel 2021`);
            }
        });
        console.log("let's go")
    }
}