const { MessageActionRow , MessageAttachment, MessageEmbed } = require('discord.js')
const fs = require('fs');
module.exports = {
    name: 'listtemplates',
    async execute(interaction, Discord, client) {

        globalThis.startingID = "0001";

        const next1 = new Discord.MessageButton().setCustomId('next1').setStyle('PRIMARY').setLabel('').setEmoji('▶️');
        const next2 = new Discord.MessageButton().setCustomId('next2').setStyle('PRIMARY').setLabel('').setEmoji('⏩');
        const back1 = new Discord.MessageButton().setCustomId('back1').setStyle('PRIMARY').setLabel('').setEmoji('◀️');
        const back2 = new Discord.MessageButton().setCustomId('back2').setStyle('PRIMARY').setLabel('').setEmoji('⏪');

        let rawData = fs.readFileSync('../derya-bot/templateshit/data.json');
        globalThis.data = JSON.parse(rawData);
        globalThis.jsonlength = data.length;

        let deletedCount = 0;

        for (i = 0; i < jsonlength; i++) {
            if (data[i].name == "DELETED") {
                deletedCount++;
            }
        }

        globalThis.getLinkAndCoordinatesById = function (id) {
            const maxId = Math.max(...data.map(item => parseInt(item.id, 10)));
            if (parseInt(id, 10) > maxId) {
                interaction.followUp({ content: "No ID found!", ephemeral: true });
                return null;
            }
            let jsonfile = data.find(item => item.id === id.padStart(4, '0'));

            if (!jsonfile) return null;
            
            let isDeleted = false;
            
            if (jsonfile.name == "DELETED") {
                id = (parseInt(id, 10) + 1).toString().padStart(4, '0');
                isDeleted = true;
                jsonfile = data.find(item => item.id === id.padStart(4, '0'));
            }


            return {
                name: jsonfile.name,
                link: jsonfile.link,
                coordinates: jsonfile.coordinates,
                maxId: maxId,
                owner: jsonfile.owner,
                visibility: jsonfile.visibility,
                guildID: jsonfile.guildID,
                isDeleted: isDeleted
            };
        };

        globalThis.result = getLinkAndCoordinatesById(startingID);

        if (!result) {
            return interaction.followUp({ content: "Couldn't find a template with this ID.", ephemeral: true });
        }

        globalThis.sendEmbed = function (interaction) {
            if (!result) return;
            const pages = new Discord.MessageButton().setCustomId('pages').setStyle('SECONDARY').setLabel(`${Number(globalThis.startingID > deletedCount ? globalThis.startingID - deletedCount: globalThis.startingID)}/${result.maxId - deletedCount}`).setDisabled(true);
            globalThis.row = new MessageActionRow().addComponents(back2, back1, pages, next1, next2);

            const file = new MessageAttachment(`templateshit/images/${startingID}.png`);
            const embed = new MessageEmbed()
                .addField(`Template Name`, result.visibility === "true" ? result.name : "hidden")
                .addField(`Coordinates`, result.visibility === "true" ? result.coordinates : "hidden")
                .addField(`Added by`, result.visibility === "true" ? result.owner : "hidden")
                .setFooter(`ID: ${startingID}`, "https://cdnb.artstation.com/p/assets/images/images/051/731/105/large/yuriy-kharmansky-broden-portrait.jpg?1658047373");

            if (result.visibility === "true" && result.visibility != "DELETED") embed.setImage(`attachment://${startingID}.png`);

            interaction.editReply({ embeds: [embed], files: result.visibility === "true" ? [file] : [], components: [row] });
        };

        await interaction.deferReply();
        sendEmbed(interaction);
    }
};
