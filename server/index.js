const express = require("express");
const app = express();
const port = 8002;
const server = require("http").Server(app);
const io = require("socket.io")(server);
const cors = require("cors");

app.use(cors());

const clients = {};
const messages = {};
const connectionsLimit = 10000;

io.on("connection", function (client) {
  if (io.engine.clientsCount > connectionsLimit) {
    client.emit("err", { message: "reach the limit of connections" });
    client.disconnect();
    return;
  }

  client.emit("receive-uid", client.id);

  client.on("join-room", (e) => {
    console.log("^^^^join", e);
    client.leaveAll();
    client.join(e.room);
    messages[e.room] &&
      messages[e.room].length &&
      messages[e.room].map((message) => {
        client.emit("message", { message });
      });
  });

  client.on("sign-in", (e) => {
    let user_id = e.id;
    if (!user_id) return;
    client.user_id = user_id;
    if (clients[user_id]) {
      clients[user_id].push(client);
    } else {
      clients[user_id] = [client];
    }
  });

  client.on("message", (e) => {
    if (!(e.to in messages)) {
      messages[e.to] = [];
    }
    messages[e.to].push(e.message);
    io.to(e.to).emit("message", e);
  });

  client.on("disconnect", function () {
    if (!client.user_id || !clients[client.user_id]) {
      return;
    }
    let targetClients = clients[client.user_id];
    for (let i = 0; i < targetClients.length; ++i) {
      if (targetClients[i] == client) {
        targetClients.splice(i, 1);
      }
    }
  });
});

app.get("/users", (req, res) => {
  res.send({ data: clients });
});

server.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);