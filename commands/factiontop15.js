const { EmbedBuilder, MessageEmbed } = require('discord.js');
const fetchPixelya = require("../functions/misc/pixelyaFetcher")

module.exports = {
    name: 'factiontop15',
    execute (interaction, Discord, client) {
        async function fetchData() {
            try {
                const data = await fetchPixelya("https://pixelya.fun/ranking", "GET")

                const factions = []
                const pixels = []

                for (let i = 0; i < 15; i++) {
                    factions.push("**Name:** [" + data.rankingFactions[i].tag + "] " + "[" + data.rankingFactions[i].name + `#${data.rankingFactions[i].id}](https://pixelya.fun/faction?name=${encodeURIComponent(data.rankingFactions[i].name)}` + `)` + "\n")
                    pixels.push("**Total Pixels:** " + data.rankingFactions[i].tp + "\n" + "**Daily Pixels:** " + data.rankingFactions[i].dp + "\n" + "**Member Count:** " + data.rankingFactions[i].mp + "\n")
                }

                //const finalPlayerData = players.join("")
                //const finalPixelsData = pixels.join("")

                var playersEmbed = new MessageEmbed()
                playersEmbed.setTitle(`Top 15 Factions`)
                for (let i = 0; i < factions.length; i++) 
                {
                    //playersEmbed.addField(factions[i], pixels[i], true)
                    playersEmbed.addField(`${i +1})`, factions[i] + pixels[i], true)
                }                    

                interaction.reply({ embeds: [playersEmbed] });
                
            } catch (error) {
                console.error("Hata oluştu:", error);
            }
        }
        fetchData();
    }
}