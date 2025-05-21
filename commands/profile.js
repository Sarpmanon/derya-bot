const checkRank = require("../functions/top15/checkRank")
const fs = require('fs');

module.exports = {
    name: "profile",
    async execute(interaction, Discord, client) {
      const idInput = interaction.options.getUser("userid")
      //eğer boşsa null olur

      async function checkTag(data, badges, type) {
        const badgeMap = {
          "Admin": "<:admin:1342989433460363274>",
          "Mod": "<:mod:1342989070665646160>",
          "Helper": "<:Helper:1345482721467699260>",
          "Veterann": "<:Veteran:1357006163035685005>",
          "Dev": "<:Dev:1357006160883879992>",
          "Journalist": "<:journalist:1342992391367557120>",
          "birthday_one_year": "<:1year:1342991956900315167>",
          "Christmas2023": "<:christmas2023:1342991470860308620>",
          "Halloween2024": "<a:Halloween2024:1342990837574926368>",
          "Christmas2024": ":christmas_tree:",
          "Supporter": "<a:Supporter:1363153820137295913>"
        };

        for (const [name, value] of type) {
          if (value === true || value === 1) {
            if (badgeMap[name]) {
              badges += " " + badgeMap[name];
            }
          }
        }
      
        return badges;
      }

      let localJSON = JSON.parse(fs.readFileSync("./functions/profile.json"))

      try {
        let shittyasvar = 0;
        if (idInput == null) {
          shittyasvar = interaction.user.id;
        } else {
          shittyasvar = idInput?.id;
        }

        const item = await localJSON.find(item => item.discordID === shittyasvar);
        if (item == undefined) {
           interaction.reply(`__**${idInput?.username}**__ doesn't have their account added to the bot.`)
           return; 
        }

        await interaction.deferReply();

        const json = await fetch("https://pixelya.fun/api/userinfo", {
            method: "POST",
            body: JSON.stringify({
              id: Number(item.gameID)
            }),
            headers: {
              "Content-type": "application/json"
            }
          })

          const data = await json.json();
          const patent = await checkRank(data.userinfo)

          const name = data.userinfo.namee;
          const userID = data.userinfo.id;
          
          const description = data.userinfo.descMsg;

          const createdISO = new Date(data.userinfo.createdAt);
          const createdat = createdISO.toLocaleString('en-EN')

          const lastLoginISO = new Date(data.userinfo.lastLogin);
          const lastLogin = lastLoginISO.toLocaleString('en-EN')

          const totalpixels = data.userinfo.totalPixels;
          const dailypixels = data.userinfo.dailyTotalPixels;

          const globalranking = data.userinfo.ranking;
          const dailyranking = data.userinfo.dailyRanking;
          let banrecord = "";

          if (data.userinfo.banned == true) {
            banrecord = "```ansi\n\u001b[2;31mBanned!\u001b[0m\n```"
          } else if (data.userinfo.muted == true) {
            banrecord = "```ansi\n\u001b[2;31mMuted!\u001b[0m\n```"
          } else {
            banrecord = "```ansi\n\u001b[2;32mClean!\u001b[0m\n```";
          }


          let badges = "";

          badges = await checkTag(null, badges, data.userinfo.tags);
          
          const userEmbed = new Discord.MessageEmbed()
          .setTitle(`User Profile`)
          .setURL(`https://pixelya.fun/userinfo?id=${item.gameID}`)
          .addField(`\`\`\`${data.userinfo.faction == null ? name + "#" + userID : data.userinfo.faction[0] + " " + name + "#" + userID}\`\`\` ${patent + badges}`, `\`\`\`${description == null ? "N/A" : description}\`\`\``, false)

          .addField("```Created At```", `\`\`\`${createdat}\`\`\``, false)
          .addField("```Last Seen```", `\`\`\`${lastLogin}\`\`\``, false)

          .addField("```Total Pixels```", `\`\`\`${totalpixels.toLocaleString("tr-TR")}\`\`\``, false)
          .addField("```Daily Pixels```", `\`\`\`${dailypixels.toLocaleString("tr-TR")}\`\`\``, false)

          .addField("```Global Ranking```", `\`\`\`#${globalranking}\`\`\``, false)
          .addField("```Daily Ranking```", `\`\`\`#${dailyranking}\`\`\``, false)

          .addField("```Ban Record```", `${banrecord}`, false)
         .setColor('RANDOM')
         .setThumbnail(data.userinfo.avatar == "" ? "https://pixelya.fun/unknown.png" : data.userinfo.avatar)
         .setImage(data.userinfo.banner == "/unknownBanner.png" ? "https://pixelya.fun/unknownBanner.png" : data.userinfo.banner)
         .setTimestamp()

         await interaction.editReply({ embeds: [userEmbed]})
        } catch (err) {
          console.log("hata var amk", err)
        }
        }
    }