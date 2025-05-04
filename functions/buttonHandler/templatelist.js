async function listAllTemplates(interaction) {
    if (!interaction.isButton()) return;

    if (interaction.replied || interaction.deferred) return;

    const previousIDthingy = globalThis.startingID;
    await interaction.deferUpdate();

    let numberthingy = 1;
    if (interaction.customId == "next1") numberthingy = 1;
    else if (interaction.customId == "next2") numberthingy = 10;
    else if (interaction.customId == "back1") numberthingy = -1;
    else if (interaction.customId == "back2") numberthingy = -10;

    if (globalThis.startingID == undefined) return;

    if (Number(globalThis.startingID) > globalThis.jsonlength) {
        globalThis.startingID = globalThis.jsonlength - 1;
        return;
    }
    else {
        globalThis.startingID = (Number(globalThis.startingID) + numberthingy).toString().padStart(4, "0");
        if (globalThis.jsonlength < globalThis.startingID) {
            globalThis.startingID = globalThis.jsonlength.toString().padStart(4, '0');
        }
        globalThis.result = await globalThis.getLinkAndCoordinatesById(globalThis.startingID);
        try {
            while(global.result.isDeleted == true) {
                globalThis.startingID = (Number(globalThis.startingID) + numberthingy).toString().padStart(4, "0");
                globalThis.result = await globalThis.getLinkAndCoordinatesById(globalThis.startingID);
            }
        } catch {

        }
    }

    try {
        if (globalThis.result.isDeleted == true) {
            globalThis.startingID = await (parseInt(globalThis.startingID, 10) + 1).toString().padStart(4, '0');
        }
    } catch {}

    if (Number(globalThis.startingID) <= globalThis.jsonlength) {
        globalThis.sendEmbed(interaction);
    }
}

module.exports = listAllTemplates;