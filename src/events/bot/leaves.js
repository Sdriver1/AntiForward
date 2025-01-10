require("dotenv").config();
const { EmbedBuilder } = require("discord.js");

module.exports = async (client, guild) => {
  if (!guild.available) {
    return;
  }

  const channel = client.channels.cache.get(process.env.log_channel);
  const name = guild.name || "undefined";
  const serverID = guild.id || "undefined";
  const memberCount = guild.memberCount || "undefined";
  const currentGuildCount = client.guilds.cache.size;
  let totalUserCount = 0;

  client.guilds.cache.forEach((guild) => {
    totalUserCount += guild.memberCount;
  });

  const embed = new EmbedBuilder()
    .setColor("#5865F2")
    .setTitle(`❌ Left Server`)
    .addFields(
      {
        name: "Server Info",
        value: `**Server Name:** **${name}** (\`${serverID}\`)\n**Member Count:** \`${memberCount}\`\n**Joined:** <t:${parseInt(
          guild.joinedTimestamp / 1000
        )}:F> (<t:${parseInt(guild.joinedTimestamp / 1000)}:R>)`,
      },
      {
        name: "Bot Info",
        value: `**Total # of guild:** \`${currentGuildCount}\` \n**Total user count**: \`${totalUserCount}\``,
      }
    )
    .setTimestamp()
    .setFooter({ text: `${serverID}` });

  if (channel) {
    await channel.send({ embeds: [embed] });
  } else {
    console.error(`Channel with ID ${channel} not found.`);
  }
};
