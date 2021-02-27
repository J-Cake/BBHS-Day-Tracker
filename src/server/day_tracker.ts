import * as path from "path";
import * as fs from "fs";

import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as sm from 'source-map-support'

import router from './router';
import user from './user';
import start from "./start";

sm.install();

const app = express();

const log = fs.createWriteStream(path.join(process.cwd(), ".request.log"), {flags: 'a', encoding: "utf8"});

app.set('views', path.join(process.cwd(), 'views'));
app.set('view engine', 'pug');

app.use(morgan("combined", {stream: log}));
app.use(morgan("dev"));

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(process.cwd(), "public")));

app.use("/", user);
app.use("/api", router);

const port = Number(process.argv[2]) || 5491;

app.listen(isNaN(port) ? 5491 : port, function (): void {
    console.log("Listening on", port);
    start();
});
