const { Events } = require("discord.js");
const database = require("../../../database/database");

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) return;

    const isForwarded = message.reference && message.reference.type === 1;

    if (isForwarded) {
      database.getServerConfig(message.guild.id, (config) => {
        const allowedChannels = config.allowed_channels
          ? config.allowed_channels.split(",")
          : [];
        const allowedUsers = config.allowed_users
          ? config.allowed_users.split(",")
          : [];
        const allowedRoles = config.allowed_roles
          ? config.allowed_roles.split(",")
          : [];

        const isAllowedChannel = allowedChannels.includes(message.channel.id);
        const isAllowedUser = allowedUsers.includes(message.author.id);
        const isAllowedRole = message.member.roles.cache.some((role) =>
          allowedRoles.includes(role.id)
        );

        if (!isAllowedChannel && !isAllowedUser && !isAllowedRole) {
          message
            .delete()
            .then(() => {
              database.incrementStat("deleted_messages");
            })
            .catch((err) => console.error(`Failed to delete message: ${err}`));

          message.channel
            .send(`${message.author}, forwarded messages are not allowed here.`)
            .then((msg) => setTimeout(() => msg.delete(), 10000))
            .catch((err) =>
              console.error(`Failed to send notification: ${err}`)
            );
        }
      });
    }
  },
};
