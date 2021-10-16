const { Client, Collection } = require('discord.js');
const { TOKEN, PREFIX} = require('./config');
const { readdirSync} =require("fs");

const client = new Client( );
client.commands = new Collection( );

//Charge les commands
const loadCommands = (dir = "./commands/") => {
  readdirSync(dir).forEach(dirs => {
    const commands = readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith(".js"));
    for (const file of commands) {
      const getFileName = require(`${dir}/${dirs}/${file}`);
      client.commands.set(getFileName.help.name, getFileName);
      console.log(`Commande chargée: ${getFileName.help.name}`);
    };
  });
};
//Charge les events
const loadEvents = (dir = "./events/") => {
  readdirSync(dir).forEach(dirs => {
    const events = readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith(".js"));
    for (const event of events) {
      const evt = require(`${dir}/${dirs}/${event}`);
      const evtName = event.split(".") [0];
      client.on(evtName, evt.bind(null, client));
      console.log(`Evenement chargée: ${evtName}`);
    };
  });
};


loadCommands();
loadEvents();

client.on('message', message => {
  if(!message.content.startsWith(PREFIX) || message.author.bot)return;
  const args = message.content.slice(PREFIX.length).split(/ +/);
  const command = args.shift().toLowerCase();

  if(!client.commands.has(command)) return;
  client.commands.get(command).run(message, args);

})

client.login(TOKEN);