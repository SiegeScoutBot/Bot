import { Client } from "discord.js";

export default class Event {
  name: string;
  once: boolean;

  constructor(name: string, once: boolean) {
    this.name = name;
    this.once = once;
  }

  async execute(...args: any) {
    throw new Error("Event not implemented");
  }

  async register(client: Client) {
    client.on(this.name, (...args: any) => this.execute(...args));
  }

  async unregister(client: Client) {
    client.removeListener(this.name, (...args: any) => this.execute(...args));
  }
}
