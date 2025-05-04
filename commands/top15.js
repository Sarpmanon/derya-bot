const { EmbedBuilder, MessageEmbed } = require('discord.js');
const checkRank = require("../functions/top15/checkRank")
const fetchPixelya = require("../functions/misc/pixelyaFetcher")

module.exports = {
    name: 'top15',
    execute (interaction, Discord, client) {
      const chosenOption = interaction.options.getString("kategori")
      //total ve daily
      //dailyRanking ranking

        async function fetchData() {
            try {
              const data = await fetchPixelya("https://pixelya.fun/ranking", "GET")
                let rankingData;
                let degiskenisteamk;


                if (chosenOption == 'total') {
                  rankingData = data.ranking;
                  degiskenisteamk = 'Total';
                }
                else {
                  rankingData = data.dailyRanking;
                  degiskenisteamk = 'Daily';
                }

                const players = []
                const pixels = []
                let badges = []
                let embedImage = ''
                let weirdassnumber = 15;

                if (rankingData.length < 15) weirdassnumber = rankingData.length;

                for (let i = 0; i < weirdassnumber; i++) {

                    const patentnow = await checkRank(rankingData[i])

                    badges = rankingData[i].tags
                    badges2 = ''

                    if (badges.includes('Admin')) {
                        badges2 = badges2.concat(' <:admin:1342989433460363274>')
                    }
                    if (badges.includes('Mod')) {
                      badges2 = badges2.concat(' <:mod:1342989070665646160>')
                        }
                    if (badges.includes('Halloween2024')) {
                      badges2 = badges2.concat(' <a:Halloween2024:1342990837574926368>')
                    }
                    if (badges.includes('Christmas2024')) {
                      badges2 = badges2 + ' :christmas_tree:'
                    }
                    if (badges.includes('Christmas2023')) {
                      badges2 = badges2 + ' <:christmas2023:1342991470860308620>'
                    }
                    if (badges.includes('birthday_one_year')) {
                      badges2 = badges2.concat(' <:1year:1342991956900315167>')
                    }
                    if (badges.includes('Journalist')) {
                      badges2 = badges2.concat(' <:journalist:1342992391367557120>')
                    }
                    if (badges.includes('Helper')) {
                      badges2 = badges2.concat(' <:Helper:1345482721467699260>')
                    }
                    if (badges.includes('Veteran')) {
                      badges2 = badges2.concat(' <:Veteran:1357006163035685005>')
                    }
                    if (badges.includes('Dev')) {
                      badges2 = badges2.concat(' <:Dev:1357006160883879992>')
                    }

                    if (i + 1 == 1) {
                      badges2 = badges2.concat(' <:top1_daily:1345548290887778384>')
                    } else {
                      if (i + 1 == 2) {
                        badges2 = badges2.concat(' <:top2_daily:1345548289445199883>')
                      } else {
                        if (i + 1  == 3) {
                          badges2 = badges2.concat(' <:top3_daily:1345548288115474473>')
                        }
                      }
                    }

                    function isNumber(value) {
                      return typeof value === 'number' && !isNaN(value);
                    }
                    
                    const dailyPixelsVar = rankingData[i]?.dt ?? 0;
                    if (!isNumber(dailyPixelsVar)) {
                      dailyPixels = 0;
                    } else {
                      dailyPixels = dailyPixelsVar;
                    }
                    //console.log(dailyPixelsVar)

                    players.push("#" + (i+1) + " - " + rankingData[i].name + "#" + rankingData[i].id + "  " + patentnow + "" + badges2 + "\n");
                    pixels.push("\n" + "\n" + "Daily Pixels: " + dailyPixelsVar + "\n" + "Total Pixels: " + rankingData[i].t)

                    if (i == 0) {
                        if (rankingData[i].avatar != "/unknown.png") {embedImage = rankingData[i].avatar} else {embedImage = "https://pixelya.fun/PixelyaLOGO.png"}
                    }
                }

                //const finalPlayerData = players.join("")
                //const finalPixelsData = pixels.join("")

                var playersEmbed = new MessageEmbed()
                playersEmbed.setTitle(`Top ${degiskenisteamk} Players`)
                playersEmbed.setImage(embedImage)
                for (let i = 0; i < players.length; i++) 
                {
                    playersEmbed.addField(players[i], pixels[i], false)
                }                    

                interaction.reply({ embeds: [playersEmbed] });
                
            } catch (error) {
                console.error("Hata oluştu:", error);
            }
        }
        fetchData();
    }
}