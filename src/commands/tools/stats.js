const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const database = require("../../../database/database");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Displays bot statistics in an embed."),

  async execute(interaction) {
    database.getStats((stats) => {
      const deletedMessages = stats.deleted_messages || 0;
      const serverCount =
        stats.server_count || interaction.client.guilds.cache.size;

      const statsEmbed = new EmbedBuilder()
        .setColor("#5865F2")
        .setTitle("AntiForward Statistics")
        .addFields(
          {
            name: "Deleted Messages",
            value: `${deletedMessages}`,
            inline: true,
          },
          {
            name: "Servers",
            value: `${serverCount}`,
            inline: true,
          }
        )
        .setTimestamp();

      interaction.reply({ embeds: [statsEmbed] });
    });
  },
};
