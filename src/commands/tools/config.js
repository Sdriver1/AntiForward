const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const database = require("../../../database/database");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription("Manage server configuration.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("allowchannel")
        .setDescription("Allow a channel to send forwarded messages.")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Channel to allow")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("removechannel")
        .setDescription("Remove a channel from allowed list.")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Channel to remove")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("allowuser")
        .setDescription("Allow a user to send forwarded messages.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("User to allow")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("removeuser")
        .setDescription("Remove a user from allowed list.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("User to remove")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("allowrole")
        .setDescription("Allow a role to send forwarded messages.")
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("Role to allow")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("removerole")
        .setDescription("Remove a role from allowed list.")
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("Role to remove")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("showconfig")
        .setDescription("Show current configuration.")
    ),
  async execute(interaction) {
    if (
      interaction.guild.ownerId !== interaction.user.id &&
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator |
          PermissionsBitField.Flags.ManageGuild
      )
    ) {
      return interaction.reply({
        content: "You do not have permission to use this command.",
        ephemeral: true,
      });
    }

    const subcommand = interaction.options.getSubcommand();
    const serverId = interaction.guild.id;

    if (subcommand === "allowchannel") {
      const channel = interaction.options.getChannel("channel");
      database.getServerConfig(serverId, (config) => {
        const allowedChannels = config.allowed_channels
          ? config.allowed_channels.split(",")
          : [];
        if (!allowedChannels.includes(channel.id)) {
          allowedChannels.push(channel.id);
          database.addServerConfig(
            serverId,
            allowedChannels.join(","),
            config.allowed_users,
            config.allowed_roles
          );
          interaction.reply(`Channel ${channel.name} is now allowed.`);
        } else {
          interaction.reply(`${channel.name} is already allowed.`);
        }
      });
    } else if (subcommand === "removechannel") {
      const channel = interaction.options.getChannel("channel");
      database.getServerConfig(serverId, (config) => {
        const allowedChannels = config.allowed_channels
          ? config.allowed_channels.split(",")
          : [];
        if (allowedChannels.includes(channel.id)) {
          const updatedChannels = allowedChannels.filter(
            (id) => id !== channel.id
          );
          database.addServerConfig(
            serverId,
            updatedChannels.join(","),
            config.allowed_users,
            config.allowed_roles
          );
          interaction.reply(`Channel ${channel.name} has been removed.`);
        } else {
          interaction.reply(`${channel.name} is not in the allowed list.`);
        }
      });
    } else if (subcommand === "allowuser") {
      const user = interaction.options.getUser("user");
      database.getServerConfig(serverId, (config) => {
        const allowedUsers = config.allowed_users
          ? config.allowed_users.split(",")
          : [];
        if (!allowedUsers.includes(user.id)) {
          allowedUsers.push(user.id);
          database.addServerConfig(
            serverId,
            config.allowed_channels,
            allowedUsers.join(","),
            config.allowed_roles
          );
          interaction.reply(`User ${user.tag} is now allowed.`);
        } else {
          interaction.reply(`${user.tag} is already allowed.`);
        }
      });
    } else if (subcommand === "removeuser") {
      const user = interaction.options.getUser("user");
      database.getServerConfig(serverId, (config) => {
        const allowedUsers = config.allowed_users
          ? config.allowed_users.split(",")
          : [];
        if (allowedUsers.includes(user.id)) {
          const updatedUsers = allowedUsers.filter((id) => id !== user.id);
          database.addServerConfig(
            serverId,
            config.allowed_channels,
            updatedUsers.join(","),
            config.allowed_roles
          );
          interaction.reply(`User ${user.tag} has been removed.`);
        } else {
          interaction.reply(`${user.tag} is not in the allowed list.`);
        }
      });
    } else if (subcommand === "allowrole") {
      const role = interaction.options.getRole("role");
      database.getServerConfig(serverId, (config) => {
        const allowedRoles = config.allowed_roles
          ? config.allowed_roles.split(",")
          : [];
        if (!allowedRoles.includes(role.id)) {
          allowedRoles.push(role.id);
          database.addServerConfig(
            serverId,
            config.allowed_channels,
            config.allowed_users,
            allowedRoles.join(",")
          );
          interaction.reply(`Role ${role.name} is now allowed.`);
        } else {
          interaction.reply(`${role.name} is already allowed.`);
        }
      });
    } else if (subcommand === "removerole") {
      const role = interaction.options.getRole("role");
      database.getServerConfig(serverId, (config) => {
        const allowedRoles = config.allowed_roles
          ? config.allowed_roles.split(",")
          : [];
        if (allowedRoles.includes(role.id)) {
          const updatedRoles = allowedRoles.filter((id) => id !== role.id);
          database.addServerConfig(
            serverId,
            config.allowed_channels,
            config.allowed_users,
            updatedRoles.join(",")
          );
          interaction.reply(`Role ${role.name} has been removed.`);
        } else {
          interaction.reply(`${role.name} is not in the allowed list.`);
        }
      });
    } else if (subcommand === "showconfig") {
      database.getServerConfig(serverId, (config) => {
        const allowedChannels = config.allowed_channels
          ? config.allowed_channels
              .split(",")
              .map((id) => `<#${id}>`)
              .join(", ")
          : "None";
        const allowedUsers = config.allowed_users
          ? config.allowed_users
              .split(",")
              .map((id) => `<@${id}>`)
              .join(", ")
          : "None";
        const allowedRoles = config.allowed_roles
          ? config.allowed_roles
              .split(",")
              .map((id) => `<@&${id}>`)
              .join(", ")
          : "None";
        interaction.reply(
          `**Allowed Channels:** ${allowedChannels}\n**Allowed Users:** ${allowedUsers}\n**Allowed Roles:** ${allowedRoles}`
        );
      });
    }
  },
};
