

module.exports = {
   name: 'stats',
   execute(interaction, Discord, client) {
     
       const embed = new Discord.MessageEmbed()
         .addField('**Ping:** ', `${new Date().getTime() - interaction.createdTimestamp} ms`)
         .addField('**Total Member Count:** ', `${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}`)
         .addField('**Total Server Count:** ', client.guilds.cache.size.toLocaleString())
         .addField('**Total Channel Count:** ', client.channels.cache.size.toLocaleString())
         .addField('**NodeJS Version: **', process.version)
         .addField('**discordJS Version: **', `${Discord.version}`)
         .addField('**Total RAM Usage:** ', `${(process.memoryUsage().heapUsed / 1024 / 512).toFixed(2)} MB`)
         .addField('**GuildID**', `${interaction.guild.id}`)
         .setThumbnail(client.user.avatarURL())
       
       interaction.reply({ embeds: [embed], ephemeral: true});
   },
};