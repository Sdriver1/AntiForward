const { ActivityType } = require("discord.js");
const database = require("../../../database/database");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    let activityIndex = 0;

    const updatePresence = async () => {
      database.getStats((stats) => {
        if (!stats) {
          console.error("Failed to fetch stats from the database.");
          return;
        }

        const deletedMessages = stats.deleted_messages || 0;
        const serverCount = client.guilds.cache.size;
        const activities = [
          { type: ActivityType.Watching, name: `for forwarded messages` },
          {
            type: ActivityType.Playing,
            name: `with ${deletedMessages} deleted forwarded messages`,
          },
          { type: ActivityType.Watching, name: `over ${serverCount} servers` },
        ];

        const activity = activities[activityIndex];
        client.user.setPresence({
          status: "online",
          activities: [activity],
        });

        activityIndex = (activityIndex + 1) % activities.length;
      });
    };

    setInterval(updatePresence, 10000);
    await updatePresence();
  },
};
