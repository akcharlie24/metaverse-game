import dotenv from "dotenv";
import express, { Response } from "express";
import routes from "./routes/v1";

dotenv.config();

const app = express();
const HTTP_PORT = process.env.HTTP_PORT;

app.use(express.json());

app.get("/", (_req, res: Response) => {
  res.status(200).json({ message: "hello there" });
});

app.use("/api/v1", routes);

app.listen(HTTP_PORT, () =>
  console.log(`Server Started Listening on ${HTTP_PORT}`),
);
