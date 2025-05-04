const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'help',
    async execute(interaction, Discord, client) {
        const helpEmbed = new MessageEmbed()
        .setDescription(`This bot currently has **15** commands. You can get information about every one of them from here.`)
        .setThumbnail(client.user.avatarURL())
        .setColor('RANDOM')
        .addField(`:bar_chart: /stats`, `Shows the stats of the bot (RAM usage, ping etc.).`)
        .addField(`:medal: /top15 [daily or total]`, `Statistics about daily or total top 15 in PixelYa.`)
        .addField(`:military_helmet: /factioninfo [id]`, `Displays general information about a faction.`)
        .addField(`:military_helmet: /factionrankingmembers [id]`, `Displays top users of a faction.`)
        .addField(`:military_helmet: /factiontop15`, `Displays top 15 factions of all time.`)
        .addField(`:inbox_tray: /areadownload [top-left coord] [top-right coord]`, `Downloads and then sends an area on pixelya.`)
        .addField(`:medal: /dailycountryranking`, `Displays top 15 countries with most daily pixels.`)
        .addField(`👤 /profile`, `Displays a PixelYa profile of a user if their account is linked to the bot.`)
        .addField(`👤 /linkprofile`, `Links a PixelYa account to the bot if their Discord account is also connected to their PixelYa account.`)
        .addField(`🖼️ /addtemplate [name] [coords] [link] [visibility]`, `Adds your template to the bot. \n \n \t**Coords**: Coordinates of your template \n \t**Link**: The Discord CDN link of your template that you need to copy from *your browser*. \n \t**Visibility**: To toggle whether the other users can see and use your template or not.`)
        .addField(`🖼️ /checktemplate [id]`, `Displays wrongs pixels, wrong pixel count, completion percentage and other necessary stuff about your template.`)
        .addField(`🖼️ /edittemplate [id] [name] [coords] [link] [visibility]`, `Edits a template of your choice if **you are** the owner.`)
        .addField(`🖼️ /deletetemplate`, `Deletes a template from the bot if **you are** the owner.`)
        .addField(`🖼️ /listtemplates [id]`, `Displays a list of all the templates added to the bot.`)
        .addField(`⚙️ !loadcommands`, `Reloads all commands, not to be abused. Useful if your server has less than total number of commands created by the bot.`)

        interaction.reply({ embeds: [helpEmbed] })
    }
}