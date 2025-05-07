const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const Discord = require('discord.js');
const { options } = require('pg/lib/defaults');
const factioninfo = require('./factioninfo');
const dailyCountryRanking = require('./dailyCountryRanking');
const listTemplates = require('./listTemplates');

module.exports = {
	name: 'commandBuilder',
	execute(guild, client) {

       const statsComm = new SlashCommandBuilder()
         .setName('stats')
         .setDescription('Current stats of bot')


		const top15Comm = new SlashCommandBuilder()
		 .setName('top15')
		 .setDescription('top15 members')
		 .addStringOption(option => {
            return option
            .setName('kategori')
              .setDescription('total or daily idek')
			  .addChoices({
            	name: 'Total', 
            	value: 'total'
		 	  })
			   .addChoices({
            	name: 'Daily', 
            	value: 'daily'
		 	  })
             .setRequired(true);
			});

		const areadownloadComm = new SlashCommandBuilder()
		.setName('areadownload')
		.setDescription('oyundaki bir bölgeyi indirir')
			.addStringOption(option => {
			   return option
			   .setName('xkoor')
				 .setDescription('x coordinates')
				.setRequired(true);
			   })
			.addStringOption(option => {
			return option
			.setName('ykoor')
			  .setDescription('y coordinates')
			 .setRequired(true);
			})
		.addStringOption(option =>
			option.setName('canvas')
				.setDescription('canvas bruh')
				.setRequired(true)
				.addChoices(
					{ name: 'World 🌍', value: 'world' },
					{ name: 'Mini World 🗺️', value: 'mini' },
					{ name: 'Graffiti 🎨', value: 'graffiti' },
					{ name: 'Top 15 🎖️', value: 'top15' },
				));


		 const factioninfoComm = new SlashCommandBuilder()
		 .setName('factioninfo')
		 .setDescription('top15 işte')
         .addIntegerOption(option => {
            return option
            .setName('factionid')
              .setDescription('ID of the faction you wanna check')
             .setRequired(true);
			});

			const factionRankingMembersComm = new SlashCommandBuilder()
			.setName('factionrankingmembers')
			.setDescription('top players in a faction')
			.addIntegerOption(option => {
			   return option
			   .setName('factionid')
				 .setDescription('ID of the faction you wanna check')
				.setRequired(true);
			   });
		
			const factiontop15Comm = new SlashCommandBuilder()
		     .setName('factiontop15')
		     .setDescription('top 15 fucktions')

			 const dailyCountryRankingComm = new SlashCommandBuilder()
		     .setName('dailycountryranking')
		     .setDescription('top 15 countrys todeyy!!')

			 const addTemplateComm = new SlashCommandBuilder()
			 .setName('addtemplate')
			 .setDescription('add a shablon to check')
				 .addStringOption(option => {
					return option
					.setName('name')
					  .setDescription('name of your shablon')
					 .setRequired(true);
					})
				 .addStringOption(option => {
				 return option
				 .setName('coords')
				   .setDescription('ex.: 4075_-9033')
				  .setRequired(true);
				 })
				 .addStringOption(option => {
					return option
					.setName('link')
					  .setDescription('link of the shablon (discord \'s CDN or catbox could be used)')
					 .setRequired(true);
					})
				.addStringOption(option =>
					option.setName('visibility')
						.setDescription('visib')
						.setRequired(true)
						.addChoices(
							{ name: 'Visible', value: 'true' },
							{ name: 'Hidden', value: 'false' },
				))
				.addStringOption(option =>
					option.setName('canvas')
						.setDescription('canvas bruh')
						.setRequired(true)
						.addChoices(
							{ name: 'World 🌍', value: 'world' },
							{ name: 'Mini World 🗺️', value: 'mini' },
							{ name: 'Graffiti 🎨', value: 'graffiti' },
							{ name: 'Top 15 🎖️', value: 'top15' },
						));
		

			 const checkTemplateComm = new SlashCommandBuilder()
			 .setName('checktemplate')
			 .setDescription('check a shablon that was added')
				 .addStringOption(option => {
					return option
					.setName('id')
					  .setDescription('şablonunun id\'si')
					 .setRequired(true);
					});

			const listTemplatesComm = new SlashCommandBuilder()
			.setName('listtemplates')
			.setDescription('Lists all of the templates that had been added to the bot.')

			const helpComm = new SlashCommandBuilder()
			.setName('help')
			.setDescription('Help')

			const editTemplatesComm = new SlashCommandBuilder()
			.setName('edittemplate')
			.setDescription('Edits a shablon:3')
			.addStringOption(option => {
				return option
				.setName('id')
					.setDescription('id of your shablon')
					.setRequired(true);
				})
			.addStringOption(option =>
				option.setName('visibility')
					.setDescription('visib')
					.setRequired(true)
					.addChoices(
						{ name: 'Visible', value: 'true' },
						{ name: 'Hidden', value: 'false' },
					))
			.addStringOption(option => {
				return option
				.setName('name')
				  .setDescription('new name of your shablon')
				 .setRequired(false);
				})
			 .addStringOption(option => {
			 return option
			 .setName('coords')
			   .setDescription('ex.: 4075_-9033')
			  .setRequired(false);
			 })
			 .addStringOption(option => {
				return option
				.setName('link')
				  .setDescription('link of the shablon (discord \'s CDN or catbox could be used)')
				 .setRequired(false);
				});

			const profileComm = new SlashCommandBuilder()
			.setName('profile')
			.setDescription('view the profile of a member')
			.addUserOption(option => {
				return option
				.setName('userid')
				  .setDescription('ID of the profile you wanna see')
				})

			const linkprofileComm = new SlashCommandBuilder()
			.setName('linkprofile')
			.setDescription('link your pixelya account to deryabot')
			.addIntegerOption(option => {
				return option
				.setName('userid')
					.setDescription('id')
					.setRequired(true);
				});

			const deleteTempComm = new SlashCommandBuilder()
			.setName('deletetemplate')
			.setDescription('Deletes a shablon:333')
			.addStringOption(option => {
				return option
				.setName('id')
					.setDescription('id of your shablon')
					.setRequired(true);
				})

		const commands = [
        	statsComm,
			top15Comm,
			factioninfoComm,
			factionRankingMembersComm,
			factiontop15Comm,
			areadownloadComm,
			dailyCountryRankingComm,
			addTemplateComm,
			checkTemplateComm,
			listTemplatesComm,
			helpComm,
			editTemplatesComm,
			profileComm,
			linkprofileComm,
			deleteTempComm,
		];

		console.log(commands.length)
		globalThis.totalCommandNum = commands.length;

		console.log(`[COMMAND BUILDER] All ${totalCommandNum} commands have been reloaded.`)

			const rest = new REST({ version: '9' }).setToken(`${process.env.TOKEN}`);

			(async () => {
				try {
					await rest.put(
						Routes.applicationCommands(`${client.user.id}`),
						{ body: [] },

					);

					await rest.put(
						Routes.applicationGuildCommands(`${client.user.id}`, guild.id),
						{ body: commands.map(command => command.toJSON()) },

					);

				} catch (error) {
					console.error(error);

				}

			})();
		}
	};
