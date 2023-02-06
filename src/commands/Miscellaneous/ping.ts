import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { primaryEmbed } from "../../utils/embeds";
import SlashCommand from "../../structures/Commands";

export default class Ping extends SlashCommand {
  name = "ping";
  description = "Check the bots latency";

  constructor() {
    super("ping", "Ping the bot", {
      requiredPermission: [],
    });
  }

  async execute(interaction: ChatInputCommandInteraction) {
    const wsPing = interaction.client.ws.ping;
    const ping = interaction.createdTimestamp - Date.now();

    await interaction.reply({
      embeds: [
        primaryEmbed(
          "",
          `**Websocket Latency:** [**\`${wsPing}ms\`**](https://maxuk.me)\n**API Latency:** [**\`${ping}ms\`**](https://maxuk.me)`
        ),
      ],
    });
  }

  async build() {
    return new SlashCommandBuilder()
      .setName(this.name)
      .setDescription(this.description);
  }
}
