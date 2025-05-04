
async function getLinkAndCoordinatesById(id, data) {
    const maxId = Math.max(...data.map(item => parseInt(item.id, 10)));

    if (parseInt(id, 10) > maxId) {
        interaction.reply("Geçersiz ID fiksicim!")
        return null;
    }

    const jsonfile = data.find(item => item.id === id.padStart(4, '0'));

    if (!jsonfile) return null;

    return {
        name: jsonfile.name,
        link: jsonfile.link,
        coordinates: jsonfile.coordinates,
        maxId: maxId,
        owner: jsonfile.owner,
        visibility: jsonfile.visibility,
        guildID: jsonfile.guildID,
        canvasid: jsonfile.canvasid
    };
}

module.exports = getLinkAndCoordinatesById;