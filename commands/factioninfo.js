const { EmbedBuilder, MessageEmbed } = require('discord.js');

const fetchPixelya = require("../functions/misc/pixelyaFetcher")

module.exports = {
    name: 'factioninfo',
    execute (interaction, Discord, client) {
        async function fetchData(factionID) {
              const data = await fetchPixelya("https://pixelya.fun/api/getfactioninfo", "POST", interaction.options.getInteger('factionid'))
              
              let owner;
              const admins = []
              const members = []
              const banned = []
              let discord;
              let createdAt;
              let playercnt;
              let facTotalPixels;
              let facDailyTotalPixels;
              let color;

              try {
                owner = data.fac.ownerinfo[0][1] + "#" + data.fac.ownerid
              }
              catch {
                //interaction.editReply('wrong id pookie (ts pmo)')
                console.log('wrong id for factioninfo')
                return;
              }
              if (data.fac.mods == null) {
                admins.length = 0;
              } else {
                for (let i = 0; i < data.fac.mods.length; i++) 
                  {
                      admins.push(data.fac.modsinfo[i][1] + "#" + data.fac.modsinfo[i][0])
                  }
              }
              
              for (let i = 0; i < data.fac.membros.length; i++)
                {
                    members.push(data.fac.membersinfo[i][1] + "#" + data.fac.membersinfo[i][0] + "\n")
                }
              
              if (data.fac.bans == null) {
                banned.length = 0;
              }
              else {
                for (let i = 0; i < data.fac.bans.length; i++) {
                  banned.push(data.fac.bans[i])
                }
              }

                const adminsList = admins.join("\n");
                const bannedList = banned.length

                discord = data.fac.discordlink;
                createdAt = data.fac.createdate;
                playercnt = data.fac.players;
                facTotalPixels = data.fac.facTotalPixels;
                facDailyTotalPixels = data.fac.facDailyTotalPixels;
                color = data.fac.color;
                facDesc = data.fac.desc;

                if (color.length > 7 || color.length < 7) color = "#fffff"
              
              
                const embed = new MessageEmbed()
                .setTitle(`${data.fac.name + " [" + data.fac.tag + "]"}`)
                .addFields(
                  {name: "```Owner```", value: `\`\`\`${owner}\`\`\``, inline: true},
                  {name: "```Admins```", value: `\`\`\`${adminsList}\`\`\``, inline: true},
            
               )
               .addField("```Discord Link```", `\`\`\`${discord}\`\`\``)
               .addFields(
                  {name: "```Total Member Count```", value: `\`\`\`${playercnt}\`\`\``, inline: true},
                  {name: "```Total Banned Count```", value: `\`\`\`${bannedList.toString()}\`\`\``, inline: true},
               )
               .addFields(
                {name: "```Ranking```", value: `\`\`\`#${data.fac.rank[0]}\`\`\``, inline: true},
                {name: "```Total Pixel Count```", value: `\`\`\`${facTotalPixels}\`\`\``, inline: true},
               )
               .addField("```Daily Pixel Count```", `\`\`\`${facDailyTotalPixels}\`\`\``)
               .addField("```Creation Date```", `\`\`\`${createdAt}\`\`\``)
               .addField("```Description```", `\`\`\`${facDesc}\`\`\``)
               .setColor(color)
               .setImage(data.fac.avatar)
               .setTimestamp()
                    
                await interaction.deferReply();
                interaction.editReply({ embeds: [embed] });

        }

        fetchData(interaction.options.getInteger('factionid'));
    }
}