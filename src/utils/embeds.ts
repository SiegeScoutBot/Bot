import { EmbedBuilder, resolveColor } from "discord.js";

export const primaryEmbed = (title = "", description = "") =>
  new EmbedBuilder({ color: resolveColor("#377bb6"), title, description });

export const errorEmbed = (title = "", description = "") =>
  new EmbedBuilder({ color: resolveColor("Red"), title, description });
