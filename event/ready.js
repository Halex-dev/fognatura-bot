module.exports = {
    name: 'ready',
    description: 'Funzione per quando il bot si avvia',
    async execute(client){
        try{
            client.user.setPresence({
              status: 'online',
              activity: {
                name: 'La crocifissione di Gesù',
                type: 'WATCHING'
              },
            })

            console.log(`Logged in as ${client.user.tag}!`);
          }
          catch(e){
            console.log(`Error: ` + e);
          }
    }
}