import Discord, {
  ActivityType,
  REST,
  Routes,
  SlashCommandBuilder,
} from "discord.js";
import { Client, commands, start } from "../index";
import { logger } from "../utils/log";
import Event from "../structures/Events";
import SlashCommand from "../structures/Commands";

export default class Ready extends Event {
  name = "ready";
  once = true;

  constructor() {
    super("ready", true);
  }

  async execute(client: Discord.Client) {
    var time = new Date().getTime() - start.getTime();
    logger.info(`🤖 Logged in as ${client.user?.tag}`);
    logger.info(
      `📊 Watching ${client.guilds.cache.size} servers & ${client.users.cache.size} users`
    );
    logger.info(`🕑 Startup took ${time}ms`);

    Client.user?.setPresence({
      activities: [
        {
          name: "Rainbow Six Siege",
          type: ActivityType.Playing,
        },
      ],
    });

    if (["--deploy", "-d"].includes(process.argv[2])) {
      logger.debug(
        `> Deploying slash commands ${
          process.env.ENV === "development" ? "locally" : "globally"
        }...`
      );

      const rest = new REST({ version: "10" }).setToken(process.env.TOKEN!);

      const commandData: any[] = [];

      await Promise.all(
        commands.map(async (command: SlashCommand) => {
          commandData.push(
            await command.build(
              new SlashCommandBuilder()
                .setName(command.name)
                .setDescription(command.description)
            )
          );
          logger.debug(`>> Queued command ${command.name}`);
        })
      );

      if (process.env.ENV === "development") {
        try {
          await rest.put(
            Routes.applicationGuildCommands(
              Client.user!.id,
              process.env.GUILD_ID!
            ),
            { body: commandData }
          );
          return logger.debug(
            `>> Deployed commands to guild ${process.env.GUILD_ID!}`
          );
        } catch (error) {
          return logger.error(`${error}`);
        }
      }

      try {
        await rest.put(Routes.applicationCommands(Client.user!.id), {
          body: commandData,
        });
        return logger.debug(`>> Deployed commands globally`);
      } catch (error) {
        return logger.error(`${error}`);
      }
    }
  }
}
