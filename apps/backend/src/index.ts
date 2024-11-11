import express, { Response } from "express";
import routes from "./routes/v1";

const app = express();
const HTTP_PORT = 3004;

app.get("/", (_req, res: Response) => {
  res.status(200).json({ message: "hello there" });
});

app.use("/api/v1", routes);

app.listen(HTTP_PORT, () =>
  console.log(`Server Started Listening on ${HTTP_PORT}`),
);
