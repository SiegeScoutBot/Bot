import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { errorEmbed, primaryEmbed } from "../../utils/embeds";
import SlashCommand from "../../structures/Commands";
import { client } from "../../services/meilisearch";
import Operator from "../../structures/Operator";
import { SearchResponse } from "meilisearch";

export default class Ping extends SlashCommand {
  name = "operator";
  description = "View information about an operator";

  constructor() {
    super("operator", "View information about an operator", {
      requiredPermission: [],
    });
  }

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const searchResponse: SearchResponse<Record<string, any>> = await client
      .index("operators")
      .search(interaction.options.getString("operator")!, {
        limit: 1,
      });

    if (searchResponse.hits.length === 0) {
      await interaction.editReply({
        embeds: [
          errorEmbed(
            "",
            "<:Cross:1033439936944295986> **No Results!** Unable to find an operator with the specified name."
          ),
        ],
      });
      return;
    }

    const operator: Operator = searchResponse.hits[0] as Operator;

    const genderMap = {
      m: "Male",
      f: "Female",
      o: "Other",
      n: "None/Not applicable",
      u: "Unknown",
    };

    const gender = operator.meta?.gender!;
    const displayGender = genderMap[gender] || "Unknown";

    const embed = primaryEmbed()
      .setTitle(operator.name)
      .setURL(`https://rainbowsix.fandom.com/wiki/${operator.name}`)
      .setThumbnail(operator.poster)
      .addFields([
        {
          name: "About",
          value: operator.description,
        },
        {
          name: "Quote",
          value: `<:66:1033864866781466765>\`${operator.quote}\`<:99:1033864865384763402>`,
        },
        {
          name: "Ratings",
          value: `**Health**: ${operator.ratings?.health}\n**Speed**: ${operator.ratings?.speed}\n**Difficulty**: ${operator.ratings?.difficulty}`,
          inline: true,
        },
        {
          name: "Information",
          value: `**Name:** ${operator.name}\n**Role:** ${operator.role}\n**Unit:** ${operator.unit}`,
          inline: true,
        },
        {
          name: "Meta",
          value: `**Birthplace:** [**${
            operator.bio?.birthplace
          }**](https://en.wikipedia.org/wiki/${operator.bio?.birthplace
            .split(" ")
            .pop()}) ${
            operator.bio?.emoji
          }\n**Gender:** ${displayGender}\n**Height:** \`${
            operator.meta?.height! / 100
          }m\`\n**Weight:** \`${operator.meta?.weight}kg\`\n**Season:** ${
            operator.meta?.season
          }`,
        },
        {
          name: "Unlock",
          value: `**Renown:** <:renown:1072182131947749396> \`${operator.unlock?.renown}\`\n**R6 Credits:** <:credits:1072182820048474162> \`${operator.unlock?.r6credits}\``,
        },
      ]);

    await interaction.editReply({ embeds: [embed] });
  }

  async build() {
    return new SlashCommandBuilder()
      .setName(this.name)
      .setDescription(this.description)
      .addStringOption((option) =>
        option
          .setName("operator")
          .setDescription("The operator to search for")
          .setRequired(true)
          .setAutocomplete(true)
      )
      .toJSON();
  }
}
