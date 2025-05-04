const fs = require('fs');

const fetchPixelya = require("../functions/misc/pixelyaFetcher")

module.exports = {
    name: 'linkprofile',
    async execute(interaction, Discord, client) {
        try {
            const idInput = interaction.options.getInteger("userid")

            const data = await fetchPixelya("https://pixelya.fun/api/userinfo", "POST", interaction.options.getInteger('userid'))
            let localJSON = JSON.parse(fs.readFileSync("./functions/profile.json"))

            const exists = localJSON.some(user => user.discordID === interaction.user.id);

            if (data.userinfo.discordID != interaction.user.id) {
                await interaction.reply("That account doesn't belong to you, or you haven't connected your Discord account to PixelYa yet.")
                return;
            }
            else {
                if (!exists) {
                    const newData = {
                        profile: `https://pixelya.fun/api/userinfo?id=${idInput}`,
                        gameID: `${idInput}`,
                        discordID: `${interaction.user.id}`,
                    }
                    localJSON.push(newData);
                    fs.writeFileSync('./functions/profile.json', JSON.stringify(localJSON, null, 2));

                    interaction.reply(`Your PixelYa account __**${data.userinfo.namee}#${data.userinfo.id}**__ has been succesfully linked to __**DeryaBot**__.`)
                }
                else {
                    interaction.reply("You *already* have your account added to the bot.")
                }
            }
        } catch (err) {
            console.log(`[LINKPROFILE ERROR] - ${err}`)
        }
    }
}