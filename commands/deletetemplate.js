const fs = require('fs');
const { MessageActionRow , MessageAttachment, MessageEmbed } = require('discord.js')

module.exports = {
    name: "deletetemplate",
    execute(interaction, Discord, client) {
        const selectedID = interaction.options.getString("id")

        let data = JSON.parse(fs.readFileSync(`./templateshit/data.json`, 'utf8'));

        let target = data.find(obj => obj.id === selectedID);
        if(!target) return;

        const yesbutton = new Discord.MessageButton().setCustomId(`yesbutton_${interaction.user.id}`).setStyle('DANGER').setLabel('Yes').setEmoji('✅')
        const nobutton = new Discord.MessageButton().setCustomId(`nobutton_${interaction.user.id}`).setStyle('SUCCESS').setLabel('No').setEmoji('❌');

        globalThis.rowDelete = new MessageActionRow().addComponents(yesbutton, nobutton);

        interaction.reply({ content: `Are you sure you wanna delete your template: **${target.name}**? This __**CAN NOT**__ be undone.`, components: [rowDelete] })

        globalThis.deleteConfirmation = async function (option) {
            if (option == true && target.owner == interaction.user.tag) {
                console.log(`[TEMPLATE DELETION ${target.id}] - ${target.name} with coordinates ${target.coordinates} was deleted by ${target.owner} in server ${target.guildID}`)

                target.name = "DELETED";
                target.coordinates = "DELETED";
                target.link = "DELETED";
                target.id = target.id;
                target.owner = "DELETED";
                target.visibility = "DELETED";
                target.guildID = "DELETED";
                target.canvasid = "DELETED";
                target.fromlast = "DELETED";

                await fs.writeFileSync("./templateshit/data.json", JSON.stringify(data, null, 2), 'utf8');

                yesbutton.setDisabled(true)
                nobutton.setDisabled(true)
                

                await interaction.followUp({ content: "Your template has been deleted succesfully." })

                const newRow = new MessageActionRow().addComponents(yesbutton, nobutton);
                interaction.editReply({ components: [newRow] })
            } else if (option == false && target.owner == interaction.user.tag) {
                yesbutton.setDisabled(true)
                nobutton.setDisabled(true)

                await interaction.followUp({ content: "Your template wasn't deleted." })

                const newRow = new MessageActionRow().addComponents(yesbutton, nobutton);
                await interaction.editReply({ components: [newRow] })
                return;
            } else {
                yesbutton.setDisabled(true)
                nobutton.setDisabled(true)

                const newRow = new MessageActionRow().addComponents(yesbutton, nobutton);

                await interaction.followUp("This template does not belong to you or can't be deleted.")
                await interaction.editReply({ components: [newRow] })
                return;
            }
        }
    }
}