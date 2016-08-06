"use strict";
const config = require("./config.json");
const bot = new (require('eris'))(config.token);
const handlePayload = require("./handlePayload");
const whm = new (require('./WebhookMiddleware'))(config.secret, config.port);

whm.on("payload", (type, data) => {
  let res = handlePayload(type, data);
  if(res)
    bot.createMessage(config.channelID, res + "\n:bell:");
});

bot.connect();