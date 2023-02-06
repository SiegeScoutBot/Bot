import MeiliSearch from "meilisearch";
import { logger } from "../utils/log";

export const client = new MeiliSearch({
  host: process.env.MEILISEARCH_HOST || "http://localhost:7700",
  apiKey: process.env.MEILISEARCH_KEY || "masterkey",
});

if (!client.isHealthy) {
  logger.error("MeiliSearch returned an unstable state!");
  logger.error("Please check your MeiliSearch instance and try again.");
} else {
  logger.info(
    `Connected to MeiliSearch @ ${
      process.env.MEILISEARCH_HOST || "http://localhost:7700"
    }`
  );
}
