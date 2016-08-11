"use strict";

const EventEmitter = require("events").EventEmitter,
      crypto       = require("crypto"),
      http         = require("http");


class WebhookMiddleware extends EventEmitter {
  constructor(secret, port) {
    super();

    http.createServer((req, res) => {
      if (req.method === "POST") {
        let data = "";

        req.on("data", chunk => {
          data += chunk;
        });

        req.on("end", () => {
          if(!identifyRequest(req.headers['x-hub-signature'], secret, data)) return;

          res.writeHead(200, {"Content-Type": "text/plain"});
          data = JSON.parse(data);
          data.repoName = data.repository.full_name;
          data.senderName = data.sender.login;

          this.emit("payload", req.headers["x-github-event"], data);
          res.end("Successfully received '" + req.headers["x-github-event"] + "'");
        });
      }
    }).listen(port);
  }
}

var identifyRequest = (sig, secret, data) => {
  return sig && 'sha1=' + crypto.createHmac('sha1', secret).update(data).digest('hex') === sig;
};

module.exports = WebhookMiddleware;