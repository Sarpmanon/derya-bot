require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs');
const { Pool } = require('pg');
const moment = require('moment');
const { RateLimiterMemory } = require('rate-limiter-flexible');

const voidFunc = require("./functions/void");
const downloadPixelya = require("./functions/pixelyadownloader");
const gptFunc = require("./functions/gptFunc")

const listAllTemplates = require("./functions/buttonHandler/templatelist")
const checkTemplateButton = require("./functions/buttonHandler/checkTemplate")
const deleteTemplateButton = require("./functions/buttonHandler/deletetemplate")
const agacboardmain = require("./functions/agacboard/main")

const limiter = new RateLimiterMemory({
  points: 5,
  duration: 10,
});

const listtemplates = require("./commands/listTemplates")

const intentsAll = new Discord.Intents(['GUILDS', 'GUILD_MEMBERS', 'GUILD_BANS', 'GUILD_EMOJIS_AND_STICKERS', 'GUILD_INTEGRATIONS', 'GUILD_INVITES', 'GUILD_VOICE_STATES', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS']);
const client = new Discord.Client({
  intents: intentsAll,
  partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

client.commands = new Discord.Collection();
const cmdf = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of cmdf) {
    const cmd = require(`./commands/${file}`);
    client.commands.set(cmd.name, cmd);
}

client.on('messageReactionAdd', async (reaction, user) => {
  if (reaction.partial) await reaction.fetch().catch(() => null);
  if (reaction.message.partial) await reaction.message.fetch().catch(() => null);
  agacboardmain(reaction, client);
});

client.on('messageReactionRemove', async (reaction, user) => {
  if (reaction.partial) await reaction.fetch().catch(() => null);
  if (reaction.message.partial) await reaction.message.fetch().catch(() => null);
  agacboardmain(reaction, client);
});


client.once('ready', () => { // Bot başladığında
    console.log(`[STARTUP] - ${client.user.tag} is online.`);

    client.user.setPresence({
      activities: [{
        name: 'PixelYa',
        type: 'PLAYING'
      }],
      status: 'online'
    });
});

client.on('guildDelete', guild => {
    console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] - ${client.user.tag} has been kicked out of server ${guild.id}.`)
});

client.on('guildCreate', async (guild) => {
  loadCommands(guild, client);
});

client.on('messageCreate', async message => {
    if (message.author.bot || !message.guild) return;

    const guildCommands = await client.application.commands.fetch({ guildId: message.guild?.id });
    if (guildCommands.size != 15) {
      loadCommands(message.guild, client)
    }

    /* BUGGY
    if (zencimessage == ""){
      zencimessage = message;
      await loadCommands(message, client)
      console.log(`[COMMANDS] All ${global.totalCommandNum} commands have been loaded.`)
    }*/

    try {
      await limiter.consume(message.author.id);
    } catch {
      message.reply("rate-limit zubidi zapidi");
      return;
    }

    if (message.content.toLowerCase() == "!loadcommands") {
      loadCommands(message.guild, client)
      message.channel.send("All commands have been reloaded")
    }

    if (message.content.startsWith("https://pixelya.fun/#")) {
      downloadPixelya(message);
      return;
    }

    if (message.content == "when void" || message.content == "void" || message.content == "void zamanı") {
      voidFunc(message, client);
      return
    }

    //AGAC function, you can ignore this, and this is probably one of the most unefficient ways to do this but still, if it works i dont touch it
    /* if (message.content.includes("<:AGAC:1067238356376895540>") || message.content.includes("AGAC") || message.content.includes("agac") || message.content.includes("Agac")) {
      sendAGAC(message);
    } */

    gptFunc(message, client);
});

/* function sendAGAC(message) {
  message.react("<:AGAC:1067238356376895540>")
} */

client.on('interactionCreate', async(interaction) => {
	//if (!interaction.isCommand()) return;

  if (interaction.isButton()) {
    if (interaction.customId != undefined && interaction.customId == "next1" || interaction.customId == "next2" || interaction.customId == "back1" || interaction.customId == "back2") {
      listAllTemplates(interaction); //nested-ass ifs
    }
  } else if (interaction.isButton()) {
    if (interaction.customId != undefined && interaction.customId.startsWith("yesbutton") || interaction.customId.startsWith("nobutton")) {
      deleteTemplateButton(interaction);
    }
  } else if (interaction.isButton()) {
    if (interaction.customId != undefined && interaction.customId.startsWith("json") || interaction.customId.startsWith("templatebutton")) {
      checkTemplateButton(interaction);
    }
  }

	const { commandName } = interaction;
    if (commandName == 'stats') {
      client.commands.get('stats').execute(interaction, Discord, client);
    }
    if (commandName == 'top15') {
      client.commands.get('top15').execute(interaction, Discord, client);
    }
    if (commandName == 'factioninfo') {
      client.commands.get('factioninfo').execute(interaction, Discord, client);
    }
    if (commandName == 'factionrankingmembers') {
      client.commands.get('factionrankingmembers').execute(interaction, Discord, client);
    }
    if (commandName == 'factiontop15') {
      client.commands.get('factiontop15').execute(interaction, Discord, client);
    }
    if (commandName == 'areadownload') {
      client.commands.get('areadownload').execute(interaction, Discord, client);
    }
    if (commandName == 'dailycountryranking') {
      client.commands.get('dailycountryranking').execute(interaction, Discord, client);
    }
    if (commandName == 'addtemplate') {
      client.commands.get('addtemplate').execute(interaction, Discord, client);
    }
    if (commandName == 'checktemplate') {
      client.commands.get('checktemplate').execute(interaction, Discord, client);
    }
    if (commandName == 'listtemplates') {
      client.commands.get('listtemplates').execute(interaction, Discord, client);
    }
    if (commandName == 'help') {
      client.commands.get('help').execute(interaction, Discord, client);
    }
    if (commandName == 'edittemplate') {
      client.commands.get('edittemplate').execute(interaction, Discord, client);
    }
    if (commandName == 'profile') {
      client.commands.get('profile').execute(interaction, Discord, client);
    }
    if (commandName == 'linkprofile') {
      client.commands.get('linkprofile').execute(interaction, Discord, client);
    }
    if (commandName == 'deletetemplate') {
      client.commands.get('deletetemplate').execute(interaction, Discord, client);
    }
});

async function loadCommands(message, client) {
  client.commands.get('commandBuilder').execute(message, client);
}

client.on('debug', (info) => {
  if (info.includes('429')) {
      const currentDate = new Date().toDateString();
      console.log(`⚠️ Rate Limit Yedik! → ${info} \n${currentDate}`);

      setTimeout(() => {
        client.channels.cache.get(`470346119130513418`)
          .send(`yine rate-limit yedin aptal orsbbucocu <@1198735588115873863>`);
      }, 5000);
  }
});

client.login(process.env.TOKEN);
