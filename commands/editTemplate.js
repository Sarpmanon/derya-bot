const fs = require('fs');

const getImage = require("../functions/misc/imageDownloader")

module.exports = {
    name: 'edittemplate',
    async execute(interaction, Discord, client) {
        const selectedID = interaction.options.getString("id")
        const newName = interaction.options.getString("name")
        const newCoords = interaction.options.getString("coords")
        const newLink = interaction.options.getString("link")
        const newVis = interaction.options.getString("visibility")

        let data = JSON.parse(fs.readFileSync(`./templateshit/data.json`, 'utf8'));

        let target = data.find(obj => obj.id === selectedID);

        if (target && target.owner == interaction.user.tag) {
            if (newName == null) {
                target.name = target.name;
            } else if (newName.trim().length >= 1) {
                target.name = newName;
            } else {
                target.name = target.name;
            }

            if (newCoords == null) {
                target.coordinates = target.coordinates;
            } else if (newCoords.trim().length >= 4 || newCoords.trim().length <= 12) {
                target.coordinates = newCoords;
            } else {
                target.coordinates = target.coordinates;
            }

            if (newLink == null) {
                target.link = target.link;
            } else if (newLink.trim().length >= 1) {
                target.link = newLink;
                getImage(newLink, selectedID)
            } else {
                target.link = target.link;
            }

            if (newVis == null) {
                target.visibility = target.visibility;
            } else if (newVis.trim().length >= 1) {
                target.visibility = newVis;
            } else {
                target.visibility = target.visibility;
            }

            try {
                await fs.writeFileSync("./templateshit/data.json", JSON.stringify(data, null, 2), 'utf8');
                interaction.reply("Your template has been edited succesfully.")
            }
            catch (err) {
                interaction.reply("There has been an error.")
                console.log(`[EDIT TEMPLATE ERROR] - ${err}`)
            }
        } else {
            interaction.reply("You are not the owner of this template.")
        }
    }
}