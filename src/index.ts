import { readdirSync } from "fs";
import path from "path";
import { logger } from "./utils/log";
import Discord, { GatewayIntentBits } from "discord.js";

import SlashCommand from "./types/Commands";
import Events from "./types/Events";

logger.info("🤖 Starting SiegeScout...");

import "./utils/config";
// Move this to a more dynamic way of loading services
import "./services/sentry";
import "./services/meilisearch";

export const start = new Date();

export const Client = new Discord.Client({
  intents: [GatewayIntentBits.Guilds],
});

logger.info("> Loading commands and events...");

// Load the commands
export const commands = new Discord.Collection<string, SlashCommand>();
const loadingCommands = (async () => {
  const commandFolders = readdirSync(path.join(__dirname, "commands"));
  for (const folder of commandFolders) {
    const commandFiles = readdirSync(
      path.join(__dirname, "commands", folder)
    ).filter((file) => file.endsWith(".ts" || ".js"));

    for (const file of commandFiles) {
      try {
        const command = (
          await import(path.join(__dirname, "commands", folder, file))
        ).default;
        const commandData: SlashCommand = new command();
        commands.set(commandData.name, commandData);
        logger.info(
          `>> Loaded command ${commandData.name} (${folder}/${file})`
        );
      } catch (error) {
        logger.error(`Failed to load command ${file}`);
        logger.error(`${error}`);
      }
    }
  }
  logger.info(`Loaded all commands (${commands.size} commands)`);
})();

// Load the events
export const events = new Discord.Collection<string, Events>();
const loadingEvents = (async () => {
  const eventFiles = readdirSync(path.join(__dirname, "events")).filter(
    (file) => file.endsWith(".ts" || ".js")
  );

  for (const file of eventFiles) {
    try {
      const event = (await import(path.join(__dirname, "events", file)))
        .default;
      const eventData: Events = new event();
      events.set(eventData.name, eventData);
      eventData.register(Client);
      logger.info(`>> Loaded event ${eventData.name} (${file})`);
    } catch (error) {
      logger.error(`Failed to load event ${file}`);
      logger.error(`${error}`);
    }
  }
  logger.info(`Loaded all events (${events.size} events)`);
})();

Promise.all([loadingCommands, loadingEvents]).then(() => {
  logger.info("Finished loading all commands and events");
  logger.info("Connecting to Discord...");
  Client.login(process.env.TOKEN);
});
