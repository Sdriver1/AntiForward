require("dotenv").config();
const { EmbedBuilder } = require("discord.js");

module.exports = async (client, guild) => {
  const channel = client.channels.cache.get(process.env.log_channel);
  const name = guild.name;
  const serverID = guild.id;
  const memberCount = guild.memberCount;

  const currentGuildCount = client.guilds.cache.size;
  let totalUserCount = 0;
  client.guilds.cache.forEach((guild) => {
    totalUserCount += guild.memberCount;
  });

  const embed = new EmbedBuilder()
    .setColor("#5865F2")
    .setTitle(`👋 New Server Joined`)
    .setFields(
      {
        name: "Server Info",
        value: `**Server Name:** **${name}** (\`${serverID}\`) \n**Member Count:** \`${memberCount}\`\n**Server Creation:** <t:${parseInt(
          guild.createdTimestamp / 1000
        )}:F> (<t:${parseInt(guild.createdTimestamp / 1000)}:R>)`,
      },
      {
        name: "Bot Info",
        value: `**Total # of guild:** \`${currentGuildCount}\` \n**Total user count**: \`${totalUserCount}\``,
      }
    )
    .setTimestamp()
    .setFooter({ text: `${serverID}` });

  await channel.send({ embeds: [embed] });
};
