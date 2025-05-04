const Discord = require("discord.js");

async function voidFunc(message, client) {
  try {
    const perms = message.channel.permissionsFor(client.user);

    const response = await fetch("https://pixelya.fun/void");
    if (!response.ok) throw new Error(`[VOID HTTP ERROR] ${response.status}`);

    if (!perms || !perms.has("SEND_MESSAGES")) return;

    const data = await response.json();
    const remainingTime = data.nextVoidIn;

    const voidEmbed = new Discord.MessageEmbed()
      .setTitle(`Void Status`)
      .setTimestamp();

    if (data.success == 0 && remainingTime.endsWith("sec.")) {
      const rmHour = Number((remainingTime.split(" ")[0].slice(0, -3))) * 60 * 60;
      const rmMin = Number(remainingTime.split(" ")[1].slice(0, -3)) * 60;
      const rmSec = Number(remainingTime.split(" ")[2].slice(0, -4));

      const currentTime = (Math.floor(new Date().getTime() / 1000.0)) + rmHour + rmMin + rmSec;
      voidEmbed.setDescription(`Next Void: <t:${currentTime}:t>`);
    } else if (data.voidRemaining.time != "N/A") {
      const nonUnixTimeRemains = data.voidRemaining.time;
      const lepercentdefrançaisfireemoji = data.voidRemaining.percen;
      voidEmbed.setDescription(`Remaining time: ${nonUnixTimeRemains} \n Percent: ${lepercentdefrançaisfireemoji}`);
    } else if (remainingTime.endsWith(" ago.")) {
      voidEmbed.setDescription(`${remainingTime}`)
    } else {
      voidEmbed.setDescription(`${data.voidInfo}`);
    }

    await message.reply({ embeds: [voidEmbed] });
  } catch (err) {
    console.error("[VOID ERROR] ", err.message);
  }
}
module.exports = voidFunc;