//this was made specifically for turkeyzone, and AI really helped too :3 so you can skip or even delete this part
const { MessageEmbed } = require('discord.js')

async function starboardMain(reaction, client) {
  const channel = reaction.message.channel; // veya herhangi bir TextChannel objesi

  if (!channel.permissionsFor(channel.guild.me).has('EMBED_LINKS')) {
    return console.log("🚫 Embed göndermek için iznim yok aq!"); // appreciate the help gpt 🙏
  }

  //console.log("function çalıştı \n \n")
  //console.log(reaction.emoji.name)

  const STAR_EMOJI = 'AGAC';
  const STAR_THRESHOLD = 7;
  const STARBOARD_CHANNEL_ID = '1063182152277180578';

  if (reaction.emoji.name !== STAR_EMOJI) return;

  const message = reaction.message;
  const starboardChannel = await client.channels.fetch(STARBOARD_CHANNEL_ID);
  if (!starboardChannel) return;
  //console.log(starboardChannel)

  const messages = await starboardChannel.messages.fetch({ limit: 100 });
  const existing = messages.find(m =>
    m.embeds.length &&
    m.embeds[0].footer?.text?.includes(message.id)
  );

  const starCount = reaction.count;

  if (starCount < STAR_THRESHOLD) {
    if (existing) {
      existing.delete().catch(console.error);
    }
    return;
  }

  const embed = new MessageEmbed()
  .setColor("RANDOM")
  .setAuthor({ name: `${message.author.username}`, iconURL: `${message.author.avatarURL()}` })
  .setDescription(message.content)
  .addField("Mesaj", `[Mesaja git!](${message.url})`)
  .setFooter({ text: message.id })
  .setTimestamp()

  if (existing) {
    await existing.edit({ content: `<:AGAC:1067238356376895540> **${starCount}**`, embeds: [embed] });
  } else {
    await starboardChannel.send({ content: `<:AGAC:1067238356376895540> **${starCount}**`, embeds: [embed] });
  }
}

module.exports = starboardMain;
