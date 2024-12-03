import { WebSocketServer } from "ws";
import { User } from "./User";
import dotenv from "dotenv";

dotenv.config();

const wss = new WebSocketServer({ port: 3005 }, () => {
  console.log("Server started listening on 3005");
});

// TODO: write websocket again with COLLISION LOGIC
// TODO: needs revamping

wss.on("connection", function connection(ws) {
  console.log("yser connected");
  let user = new User(ws);
  ws.on("error", console.error);

  ws.on("close", () => {
    user?.destroy();
  });
});
