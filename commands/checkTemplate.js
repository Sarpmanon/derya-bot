const { MessageActionRow , MessageAttachment, MessageEmbed } = require('discord.js')
const fs = require('fs');
const punycode = require('punycode/');
const { exec } = require("child_process");

const getLinkAndCoordinatesById = require("../functions/misc/jsonInfoGetter")

module.exports = {
    name: 'checktemplate',
    async execute (interaction, Discord, client) {
            const checkTempID = interaction.options.getString("id")

            //console.log(interaction.user.tag)

            const jsonbutton = new Discord.MessageButton().setCustomId(`json_${interaction.user.id}`).setStyle('SUCCESS').setLabel('JSON').setEmoji('📜').setDisabled(true)
            const templatebutton = new Discord.MessageButton().setCustomId(`templatebutton_${interaction.user.id}`).setStyle('SUCCESS').setLabel('Template').setEmoji('🖼️');

            globalThis.rowTemp = new MessageActionRow().addComponents(jsonbutton, templatebutton);

            let rawData = fs.readFileSync('../derya-bot//templateshit/data.json');
            let data = JSON.parse(rawData)

            const result = await getLinkAndCoordinatesById(checkTempID, data, interaction);

            if (!result) {
                return;  //ol artık amk
            }

            if (result.guildID == interaction.guild.id || result.visibility == "true") {

                //interaction.reply('Verin indiriliyor fiksicim...')
                interaction.deferReply();

                exec(`python templateshit\\getPercentage.py ${result.canvasid} ${result.coordinates} templateshit\\images\\${checkTempID}.png true ${interaction.user.id}`, async (error, stdout, stderr) => {
                    if (error) {
                        console.log(`[AREADOWNLOAD ERROR]: ${error.message}`);
                        if (error.message.includes("aiohttp.client_exceptions.ContentTypeError")) {
                            interaction.editReply("522 Derya couldn't be reached")
                        }
                        return;
                    }
                    
                    if (stderr) {
                        console.log(`areadownload stderr: ${stderr}`);
                        return;
                    }

                    //const file = new AttachmentBuilder('./images/example.png');
                    console.log(stdout)

                    const [final_X, final_Y] = result.coordinates.split("_") //4075_-9033

                    const [completion, totalPixels, wrongPixels, imageWidth, imageHeight] = stdout.split("-")

                    //var embed = new MessageEmbed()
                    //embed.setTitle(`Shablon Bilgisi`)
                    //embed.setImage(`templateshit\\out.png`)
                    //embed.addField('test', 'test2', false)

                    let varIprobablywillforget = "";
                    switch(result.canvasid) {
                        case '5':
                            varIprobablywillforget = "World 🌍";
                          break;
                        case '0':
                            varIprobablywillforget = "Mini World 🗺️";
                          break;
                        case '1':
                            varIprobablywillforget = "Graffiti 🎨";
                          break;
                        case '6':
                            varIprobablywillforget = "Top 15 🎖️";
                          break;
                      }

                    let target = data.find(obj => obj.id === checkTempID);

                    target.name = target.name;
                    target.coordinates = target.coordinates
                    target.link = target.link
                    target.id = target.id
                    target.owner = target.owner
                    target.visibility = target.visibility
                    target.guildID = target.guildID
                    target.canvasid = target.canvasid

                    const correctPixels = Number(totalPixels) - Number(wrongPixels)
                    let imtiredofthesefuckassvariables = "+";

                    let zoomPoint = "";
                    zoomPoint = (Number(final_X) + (Number(imageWidth) / 2)) + "," + (Number(final_Y) + (Number(imageHeight) / 2))


                    const file = new MessageAttachment(`${interaction.user.id}.png`, `${interaction.user.id}.png`);
                    var embed = new MessageEmbed()
                    embed.setTitle(`${result.name}`)
                    embed.setURL(`https://pixelya.fun/#d,${zoomPoint},10`)
                    embed.setImage(`attachment://${interaction.user.id}.png`)
                    embed.setFooter(`Thanks to @Junifil for her help in the making of this bot. ID: ${checkTempID}`, 'https://images-ext-1.discordapp.net/external/YGKIglAAAUVQ6YRKh7TJTa-sXingve8n9p3XmRoWh04/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/643194794230808583/c24d2e5f0d238dd2b606baff068b4374.webp?format=webp' )
                    embed.addField(`Correct/All Pixels`, `${(Number(totalPixels) - Number(wrongPixels)).toLocaleString('tr-TR')}/${Number(totalPixels).toLocaleString('tr-TR')}`, true)
                    embed.addField(`Wrong Pixel Count`, `${Number(wrongPixels).toLocaleString('tr-TR')}`, true)
                    embed.addField(`Percentage Completion Rate`, `%${completion.toString().substring(0, 4)}`, true)
                    embed.addField(`Added by`, `${result.owner}`, true)
                    embed.addField(`Requested by`, `${interaction.user.tag}`, true)
                    embed.addField(`Canvas`, `${varIprobablywillforget}`, true)

                    if (Math.sign(correctPixels - Number(result.fromlast)) == 1) {
                        imtiredofthesefuckassvariables = "+" + (correctPixels - Number(result.fromlast));
                    } else if (Math.sign(correctPixels - Number(result.fromlast)) == -1) {
                        imtiredofthesefuckassvariables = "-" + (correctPixels - Number(result.fromlast));
                    } else {
                        imtiredofthesefuckassvariables = "0... This isn't going anywhere."
                    }

                    embed.addField(`From Last`, `${imtiredofthesefuckassvariables}`, true)

                    target.fromlast = (Number(totalPixels) - Number(wrongPixels)).toString();
                    console.log(target.fromlast)

                    await fs.writeFileSync("./templateshit/data.json", JSON.stringify(data, null, 2), 'utf8');

                    const zemcidegisken = 1;
                    const checkFileExistence = setInterval(async () => {
                        if (fs.existsSync(`${interaction.user.id}.png`)) {
                            try {
                                await interaction.editReply({
                                    content: "Everything is set!",
                                    embeds: [embed],
                                    files: [file],
                                    components: [rowTemp]
                                });

                                clearInterval(checkFileExistence);
                                if (zemcidegisken == 1) {
                                    fs.unlinkSync(`${interaction.user.id}.png`);
                                    zemcidegisken = 0;
                                }
                            } catch (err) {
                                //console.error("Hata oluştu:", err);
                                clearInterval(checkFileExistence);
                            }
                        }
                    }, 1000);
            

                //console.log(result)
                //interaction.reply(`https://${punycode.toUnicode(result.link.replace("https://", ""))}` + " " + result.coordinates)
            })
    } else {
        interaction.reply("You cannot use this template in this server.")
    }

    globalThis.sendFollowupCheckTemplate = async function (isJSON) {
        if (isJSON == true) {
            const realFuckingCoordinates = result.coordinates.split("_")
            interaction.followUp(`\`\`\`{"imageUrl":"${result.link}","modifiers":{"autoSelectColor":true,"imageBrightness":0,"shouldConvertColors":false},"placementConfiguration":{"xOffset":${realFuckingCoordinates[0]},"yOffset":${realFuckingCoordinates[1]},"transparency":40}}\`\`\``)
        } else {
            const file2 = new MessageAttachment(`./templateshit/images/${checkTempID}.png`, `${checkTempID}.png`);
            var embed2 = new MessageEmbed()
            embed2.setImage(`attachment://${checkTempID}.png`)
            .setTitle(`${result.name}`)
            .addField(`Coordinates`, `${result.coordinates}`)
            
            await interaction.followUp({content: "Template file:", embeds: [embed2], files: [file2] });
            templatebutton.setDisabled(true)
            secondRow = new MessageActionRow().addComponents(jsonbutton, templatebutton);
            await interaction.editReply({ components: [secondRow] })
        }
    }
    }
}