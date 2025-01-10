const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("github")
    .setDescription("Bot's source code | PRs are welcome"),

  async execute(interaction) {
    const inviteEmbed = new EmbedBuilder()
      .setColor("#5865F2")
      .setTitle("AntiForward Github")
      .setURL("https://github.com/sdriver1/AntiForward")
      .setTimestamp();

    interaction.reply({ embeds: [inviteEmbed] });
  },
};
