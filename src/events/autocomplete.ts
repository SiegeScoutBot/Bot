import { AutocompleteInteraction } from "discord.js";
import Event from "../structures/Events";
import { client } from "../services/meilisearch";

export default class CommandHandler extends Event {
  constructor() {
    super("interactionCreate", false);
  }

  async execute(interaction: AutocompleteInteraction) {
    if (!interaction.isAutocomplete()) return;

    if (interaction.commandName !== "operator") return;

    const value = interaction.options.getFocused();

    const results = await client
      .index("operators")
      .search(value, { limit: 25 });

    await interaction.respond(
      results.hits.map((hit) => ({ name: hit.name, value: hit.id.toString() }))
    );
  }
}
