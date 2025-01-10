require("dotenv").config();
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const fs = require("fs");

module.exports = (client) => {
  client.handleCommands = async () => {
    const commandFolders = fs.readdirSync("./src/commands");
    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(`./src/commands/${folder}`)
        .filter((file) => file.endsWith(".js"));

      const { commands, commandArray } = client;
      for (const file of commandFiles) {
        const command = require(`../../commands/${folder}/${file}`);
        if (!command.data) {
          console.log(`Command: ${file} does not export a 'data' property`);
          continue;
        }
        commands.set(command.data.name, command);
        commandArray.push(command.data.toJSON());
        console.log(`Command: ${command.data.name} is ready to deploy ✅`);
      }
    }

    const clientID = process.env.clientId;
    const guildID = "";
    const rest = new REST({ version: "10" }).setToken(process.env.token);
    try {
      console.log("Started refrshing application commands");

      await rest.put(Routes.applicationCommands(clientID, guildID), {
        body: client.commandArray,
      });

      console.log("Successfully reloaded application commands");
    } catch (error) {
      console.error(error);
    }
  };
};
