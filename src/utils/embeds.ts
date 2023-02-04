import { EmbedBuilder, resolveColor } from "discord.js";

export const primaryEmbed = (title: string = "", description: string = "") =>
  new EmbedBuilder({ color: resolveColor("#377bb6"), title, description });

export const errorEmbed = (title: string = "", description: string = "") =>
  new EmbedBuilder({ color: resolveColor("Red"), title, description });
