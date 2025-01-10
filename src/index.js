require("dotenv").config();
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
client.commands = new Collection();
client.commandArray = [];
client.botStartTime = Math.floor(Date.now() / 1000);

const functionFolders = fs.readdirSync(`./src/functions`);
for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of functionFiles) {
    require(`./functions/${folder}/${file}`)(client);
  }
}

process.on("unhandledRejection", async (reason) => {
  console.error(reason);
});

process.on("uncaughtException", async (error) => {
  console.error(error);
});

const commandsPath = "./src/commands";
const clientId = process.env.clientId;
client.handleCommands(commandsPath, clientId);
client.handleEvents();
client.login(process.env.token);

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});
