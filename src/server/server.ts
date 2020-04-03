import * as express from 'express';
import * as path from "path";
import * as fs from "fs";
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';

import router from './router';
import user from './user';
import start from "./start";

const app = express();

const log = fs.createWriteStream(path.join(process.cwd(), ".request.log"), {flags: 'a', encoding: "utf8"});

app.use(morgan("combined", {stream: log}));
app.use(morgan("dev"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(process.cwd(), "public")));
app.use("/", user);
app.use("/api", router);

const port = 5492;

app.listen(port, function (): void {
    console.log("Listening on", port);
    start();
});