module.exports = client => {
    try{
        console.log(`Logged in as ${client.user.tag}!`);
      }
      catch(e){
        console.log(`Error: ` + e);
      }
}