
async function checkTemplateButtons(interaction) {
    try {
        if (interaction.replied || interaction.deferred) return;

        const message = await interaction.fetchReply()
        
        const interButtonID = interaction.customId.split("_")
        const allowedUserID = interButtonID[1]

        if (interaction.user.id != allowedUserID) {
            return interaction.followUp({ content: "Only the person who sent the command can use this button.", ephemeral: true })
        }


        if (interButtonID[0] == "json") {
            await globalThis.sendFollowupCheckTemplate(true);
        } else if (interButtonID[0] == "templatebutton") {
            await globalThis.sendFollowupCheckTemplate(false);
        }
    } catch (err) {
        console.log(`[CHECKTEMPLATE BUTTON ERROR] ${err}`)
    }
}
module.exports = checkTemplateButtons;