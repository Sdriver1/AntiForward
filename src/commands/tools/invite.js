const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Get the invite link for the bot."),

  async execute(interaction) {
    const inviteEmbed = new EmbedBuilder()
      .setColor("#5865F2")
      .setTitle("Invite AntiForward")
      .setDescription(
        "**Needed Perms:** [**Click Here**](https://discord.com/oauth2/authorize?client_id=1327379143717031996&permissions=10240&integration_type=0&scope=applications.commands+bot)\n- Send Messages, Manage Messages \n\n**Full Perms:** [**Click Here**](https://discord.com/oauth2/authorize?client_id=1327379143717031996&permissions=8&integration_type=0&scope=applications.commands+bot) \n- Adminstrator"
      )
      .setTimestamp();

    interaction.reply({ embeds: [inviteEmbed] });
  },
};
