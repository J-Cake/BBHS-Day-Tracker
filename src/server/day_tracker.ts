import * as path from "path";
import * as fs from "fs";
import * as os from "os";

import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as sm from 'source-map-support'

import router from './router';
import user from './user';
import getDay from "../API/getDay";

sm.install();

const app = express();

const log = fs.createWriteStream(path.join(process.cwd(), ".request.log"), {flags: 'a', encoding: "utf8"});

app.set('views', path.join(process.cwd(), 'views'));
app.set('view engine', 'pug');

app.use(morgan("combined", {stream: log}));
app.use(morgan("dev"));

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(process.cwd(), "public")));

app.use(cookieParser());
app.use(function (req: express.Request, res: express.Response, next: express.NextFunction) {
    const userToken = req.cookies.token;
    const userInfo = JSON.parse(fs.readFileSync(path.join(os.homedir(), 'data', 'day_tracker', 'users.json'), 'utf8'));

    if (userToken in userInfo)
        req.info = userInfo[userToken];
    next();
});

app.use("/api", router);
app.use("/", user);

const port = Number(process.argv[2]) || 5491;

app.listen(isNaN(port) ? 5491 : port, async function (): Promise<void> {
    console.log("Listening on", port);
    await getDay();
});
