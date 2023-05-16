"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
require("dotenv").config();
const dbConfig = require("./config/dbConfig");
const usersRoute = require("./routes/usersRoute");
const productRoute = require("./routes/productRoute");
const bidsRoute = require("./routes/bidsRoute");
const notificationRoute = require("./routes/notificationsRoute");
const app = (0, express_1.default)();
const port = process.env.PORT || 6000;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use((0, morgan_1.default)("common"));
app.use("/auth", usersRoute);
app.use("/api", productRoute);
app.use("/api", bidsRoute);
app.use("/api", notificationRoute);
const path = require("path");
__dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
    //*Set static folder up in production
    app.use(express_1.default.static("client/build"));
    app.get("*", (req, res) => res.sendFile(path.resolve(__dirname, "client", "build", "index.html")));
}
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
//# sourceMappingURL=index.js.map