import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { primaryEmbed } from "../../utils/embeds";
import SlashCommand from "../../structures/Commands";
import { redis } from "../../services/redis";
import R6API from "r6api.js";
import { logger } from "utils/log";

export default class Ping extends SlashCommand {
  name = "profile";
  description = "Lookup stats for a player";

  constructor() {
    super("profile", "Lookup stats for a player", {
      requiredPermission: [],
    });
  }

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const username = interaction.options.getString("player", true);
    const platform = interaction.options.getString("platform", true) as
      | "uplay"
      | "psn"
      | "xbl";

    const playerData = await redis.get(`player:${platform}:${username}`);

    if (!playerData) {
      logger.debug("Data does not exist in redis, fetching from ubisoft");
      const r6api = new R6API({
        email: process.env.UBISOFT_EMAIL,
        password: process.env.UBISOFT_PASSWORD,
      });

      const { 0: player } = await r6api.findByUsername(platform, username);

      const { 0: stats } = await r6api.getStats(platform, player.id);

      console.log(stats);
      return;
    }

    await interaction.editReply("Data exists in redis!");
  }

  async build() {
    return new SlashCommandBuilder()
      .setName(this.name)
      .setDescription(this.description)
      .addStringOption((option) =>
        option
          .setName("player")
          .setDescription("The player to lookup")
          // TODO: Make this false when I setup a persistant storage database
          // due to users being able to link their ubisoft accounts
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("platform")
          .setDescription("The platform of the player")
          .addChoices(
            { name: "PC", value: "uplay" },
            { name: "Playstation", value: "psn" },
            { name: "Xbox", value: "xbl" }
          )
      )
      .toJSON();
  }
}
