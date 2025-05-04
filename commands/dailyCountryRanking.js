const { EmbedBuilder, MessageEmbed } = require('discord.js');

const fetchPixelya = require("../functions/misc/pixelyaFetcher")

module.exports = {
    name: 'dailycountryranking',
    execute (interaction, Discord, client) {
        async function fetchData() { //I should find a better way to do this instead of just fucking re-using the same code every time (perhaps module.exports might help?)
            try {
                const data = await fetchPixelya("https://pixelya.fun/ranking", "GET")

                const countries = []
                const pixels = []

                for (let i = 0; i < 15; i++) {
                    countries.push(`#${i + 1} ` + data.dailyCorRanking[i].cc.toUpperCase() + " " + `:flag_${data.dailyCorRanking[i].cc}:`)
                    pixels.push("Daily Pixels: " + data.dailyCorRanking[i].px)
                }

                //console.log(countries, pixels)

                var playersEmbed = new MessageEmbed()
                    playersEmbed.setTitle(`Top 15 Countries Today`)
                    //playersEmbed.setImage(embedImage)
                for (let i = 0; i < pixels.length; i++) 
                {
                    playersEmbed.addField(countries[i], pixels[i], false)
                }


                interaction.reply({ embeds: [playersEmbed] });
            }
            catch (err) {
                interaction.reply("error: " + err)
            }
        }

        fetchData();
    }
}