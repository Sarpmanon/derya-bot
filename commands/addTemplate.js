const { EmbedBuilder, MessageEmbed } = require('discord.js');
const fs = require('fs');
const axios = require('axios');

const getImage = require("../functions/misc/imageDownloader")

module.exports = {
    name: 'addtemplate',
    execute (interaction, Discord, client) {
        try {
            const attachment = interaction.options.getString("link")

            const name = interaction.options.getString("name")
            const coordinates = interaction.options.getString("coords")
            const link = interaction.options.getString("link")
            const guildID = interaction.guild.id;
            const canvas = interaction.options.getString("canvas")
            let canvasAb = "";

            const visibility = interaction.options.getString('visibility');

            let rawData = fs.readFileSync('../derya-bot//templateshit/data.json');
            let data = JSON.parse(rawData)

            const lastId = data.length > 0 ? Math.max(...data.map(obj => Number(obj.id))) : 0;
            const newId = String(lastId + 1).padStart(4, '0');

            const username = interaction.user.tag;

            switch(canvas) {
                case 'world':
                  canvasab = "5";
                  break;
                case 'mini':
                    canvasab = "0";
                  break;
                case 'graffiti':
                    canvasab = "1";
                  break;
                case 'top15':
                    canvasab = "6";
                  break;
              }

            getImage(attachment, newId)

            const newData = {
                name: name,
                coordinates: coordinates,
                link: link,
                id: newId,
                owner: username,
                visibility: visibility,
                guildID: guildID,
                canvasid: canvasab,
                fromlast: "0"
            };

            data.push(newData);
            fs.writeFileSync('../derya-bot/templateshit/data.json', JSON.stringify(data, null, 2));
            console.log(newId)
            interaction.reply(`Your template was added succesfully. ID: __**${newId}**__ (remember that)`)
        }
        catch (err) {
            interaction.reply('Hata: ' + err)
        }
    }
}