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
          },
          {
            name: "Uptime",
            value: `${formatUptime(process.uptime())}`,
            inline: true,
          }
        )
        .setTimestamp();

      interaction.reply({ embeds: [statsEmbed] });
    });
    function formatUptime(seconds) {
      const timeUnits = {
        day: 3600 * 24,
        hour: 3600,
        minute: 60,
        second: 1,
      };
      let result = [];
      for (const [unit, amountInSeconds] of Object.entries(timeUnits)) {
        const quantity = Math.floor(seconds / amountInSeconds);
        seconds %= amountInSeconds;
        if (quantity > 0) {
          result.push(`${quantity} ${unit}${quantity > 1 ? "s" : ""}`);
        }
      }
      return result.join(", ");
    }
  },
};
