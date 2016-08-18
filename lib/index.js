"use strict";
const config = require("./config.json");
const bot = new(require('yanl')).Client();
const handlePayload = require("./handlePayload");
const whm = new(require('./WebhookMiddleware'))(config.secret, config.port);

let channel = null;

bot.on("ready", () => {
  console.log("Client ready after: " + (bot.readyTime - (Date.now() - process.uptime() * 1000)) + "ms");
  channel = bot.channels.get(config.channelID);
  channel.send("Successfully connected!");
});

whm.on("payload", (type, data) => {
  let res = handlePayload(type, data);
  console.log(res + "\n\n\n");
  if (res && channel)
    channel.send(res + "\n:bell:");
});

bot.login(config.token);