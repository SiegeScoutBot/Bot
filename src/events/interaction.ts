import { captureException, startTransaction } from "@sentry/node";
import { ChannelType, ChatInputCommandInteraction } from "discord.js";
import { commands } from "../index";
import { primaryEmbed } from "../utils/embeds";
import { logger } from "../utils/log";
import Event from "../structures/Events";

export default class CommandHandler extends Event {
  constructor() {
    super("interactionCreate", false);
  }

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.isCommand()) return;

    const command = interaction.commandName;
    const commandData = commands.get(command.toLowerCase());

    if (!commandData) {
      logger.warn(`Missing command ${command}`);
      await interaction.reply({
        embeds: [
          primaryEmbed(
            "",
            "<:Cross:1033439936944295986> **Error!** Something went wrong while executing this command!"
          ),
        ],
        ephemeral: true,
      });
      return;
    }

    if (!interaction.guild) {
      interaction.reply({
        embeds: [
          primaryEmbed(
            "",
            "<:Cross:1033439936944295986> **Error!** You cannot use this command in DMs!"
          ),
        ],
        ephemeral: true,
      });
      return;
    }

    const transaction = startTransaction({
      op: "command",
      name: `Command: ${interaction.commandName}`,
      tags: {
        guild: interaction.guild.id,
        guild_id: interaction.guild.id,
        user: interaction.user.tag,
        user_id: interaction.user.id,
        channel:
          interaction.channel?.type === ChannelType.DM
            ? "DM"
            : interaction.channel?.name,
        channel_id: interaction.channel?.id,
        command: interaction.commandName,
      },
    });

    try {
      await commandData.execute(interaction);
    } catch (error) {
      logger.error(`Failed to run command ${commandData.name}: ${error}`);
      logger.error(
        `Command ran by ${interaction.user.tag} (${interaction.user.id}) in ${
          interaction.guild.name ?? "Not in Guild"
        } (${interaction.guild.id ?? "N/A"})})`
      );
      logger.error(`${error}`);
      await interaction.reply({
        embeds: [
          primaryEmbed(
            "",
            "<:Cross:1033439936944295986> **Error!** Something went wrong while executing this command!"
          ),
        ],
        ephemeral: true,
      });
      captureException(error);
    } finally {
      transaction.finish();
    }
  }
}
