const { EmbedBuilder, MessageEmbed } = require('discord.js');
const fetchPixelya = require("../functions/misc/pixelyaFetcher")

module.exports = {
    name: 'factionrankingmembers',
    execute (interaction, Discord, client) {
        async function fetchData(factionID) {
              const data = await fetchPixelya("https://pixelya.fun/api/getfactioninfo", "POST", factionID)
              
              let owner;
              const members = []

              try {
                owner = data.fac.ownerinfo[0][1] + "#" + data.fac.ownerid
              }
              catch {
                interaction.reply('wrong id bud')
                return;
              }

              try {
              for (let i = 0; i < data.fac.membros.length; i++)
                {
                    members.push(data.fac.membersinfo[i][1] + "#" + data.fac.membersinfo[i][0] + "-" + data.fac.membersinfo[i][4] + "-" + data.fac.membersinfo[i][5])
                }

              if (data.fac.mods == null) {
                return;
              } else {
                for (let i = 0; i < data.fac.mods.length; i++) 
                  {
                      members.push(data.fac.modsinfo[i][1] + "#" + data.fac.modsinfo[i][0] + " <:silver_crown:1356629827637219523>" + "-" + data.fac.modsinfo[i][4] + "-" + data.fac.modsinfo[i][5])
                  }
              }
              members.push(data.fac.ownerinfo[0][1] + "#" + data.fac.ownerinfo[0][0] + " :crown:" + "-" + data.fac.ownerinfo[0][4] + "-" + data.fac.ownerinfo[0][5])
              //console.log(members)

              const cleanMembers = members.filter(member => member.includes('-') && !member.includes("null")
              );
              //console.log(cleanMembers)

            const topMember = data.fac.membersinfo
            .filter(p => p && p[4] !== null)
            .reduce((max, player) => (player[4] > max[4] ? player : max), data.fac.membersinfo[0]);
        

            const topMod = data.fac.modsinfo.reduce((max, mod) => 
              (mod[4] > max[4] ? mod : max), data.fac.modsinfo[0]
            );

            const topOwnerlmao = data.fac.ownerinfo.reduce((max, owner) => 
              (owner[4] > max[4] ? owner : max), data.fac.ownerinfo[0]
            );

            let topFuckingPlayer;

            topFuckingPlayer = [topOwnerlmao, topMod, topMember].filter(Boolean).sort((a, b) => b[4] - a[4])[0];
            //cleanMembers.push(topFuckingPlayer)
            //console.log(cleanMembers)

            const sortedPlayers = cleanMembers.sort((a, b) => {
              const aParts = a.split('-');
              const bParts = b.split('-');
          
              const pixelsA = parseInt(aParts[aParts.length - 2]);
              const pixelsB = parseInt(bParts[bParts.length - 2]);
          
              return pixelsB - pixelsA;
          });
          //console.log(topFuckingPlayer[3])    

                var playersEmbed = new MessageEmbed()
                playersEmbed.setTitle(`Top 15 Members in ${data.fac.name}`)
                playersEmbed.setImage(data.fac.avatar)
                //.addField(topFuckingPlayer[1] + "#" + topFuckingPlayer[0], `Total Pixels: ${topFuckingPlayer[4]} \n Daily Pixels: ${topFuckingPlayer[5]}`)
                for (let member of sortedPlayers.slice(0, 15)) {
                  let parts = member.split('-');
                  const dailyPixels = parts.pop(); // En sondaki günlük
                  const totalPixels = parts.pop(); // Ondan önceki toplam
                  const name = parts.join('-');    // Kalan kısım isim
              
                  playersEmbed.addField(name, `Total Pixels: ${totalPixels} \n Daily Pixels: ${dailyPixels}`, false);
              }              

                interaction.reply({ embeds: [playersEmbed] });

              }
              catch (error) {
                interaction.reply('ya yine mi hata oldu yapma etme gözünü seveyim ' + error)
              }

        }

        fetchData(interaction.options.getInteger('factionid'));
    }
}