import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import morgan from 'morgan'
import cors from "cors";
require("dotenv").config();
const dbConfig = require("./config/dbConfig");
const usersRoute = require("./routes/usersRoute");
const productRoute = require("./routes/productRoute");
const bidsRoute = require("./routes/bidsRoute");
const notificationRoute = require("./routes/notificationsRoute");

const app = express();
const port = process.env.PORT || 6000;

app.use(cors());
app.use(bodyParser.json());
app.use(morgan("common"));

app.use("/auth", usersRoute);
app.use("/api", productRoute);
app.use("/api", bidsRoute);
app.use("/api", notificationRoute);

const path = require("path");
__dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
  //*Set static folder up in production
  app.use(express.static("client/build"));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}


  app.listen(port, () => console.log(`Example app listening on port ${port}!`));