import {
  ChatInputCommandInteraction,
  PermissionResolvable,
  RESTPostAPIApplicationCommandsJSONBody,
  SlashCommandBuilder,
} from "discord.js";

export type SlashCommandOptions = {
  requiredPermission: PermissionResolvable[];
};

export default class SlashCommand {
  name: string;
  description: string;
  options: SlashCommandOptions;

  constructor(name: string, description: string, options: SlashCommandOptions) {
    this.name = name;
    this.description = description;
    this.options = options;
  }

  async execute(_interaction: ChatInputCommandInteraction) {
    throw new Error("Command not implemented");
  }

  async build(
    command: SlashCommandBuilder
  ): Promise<SlashCommandBuilder | RESTPostAPIApplicationCommandsJSONBody> {
    return command;
  }
}
