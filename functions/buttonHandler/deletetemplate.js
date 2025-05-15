//I hate this shit

async function deleteButtons(interaction) {
    try {
        //if (interaction.replied || interaction.deferred) return;
        await interaction.deferUpdate();

        console.log(interaction.customId)
        const [buttonCustomID, InterUserID] = interaction.customId.split("_")

        if (InterUserID != interaction.user.id) {
            return interaction.followUp({ content: "Only the person who sent the command can use this button.", ephemeral: true });
        }

        if (buttonCustomID == "yesbutton") {
            await globalThis.deleteConfirmation(true);
        } else if (buttonCustomID == "nobutton") {
            await globalThis.deleteConfirmation(false);
        }
    } catch (err) {
        console.log(`[DELETE TEMPLATE BUTTON ERROR] - ${err}`)
    }
}
module.exports = deleteButtons;
