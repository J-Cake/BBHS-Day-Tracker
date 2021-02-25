import * as express from 'express';

import decodeKey from "../API/keyDecoder";
import getDay from "../API/getDay";

const user = express.Router();

user.get('/', async function (req: express.Request, res: express.Response) {
    res.render('index', {
        title: "DayTracker",
        day: `${req.query?.date ? "That would be" : "Today is"} ${await getDay(Number(req.query?.date), req.query?.relative === "true")}`
    });
});

user.get('/absolute', async function (req: express.Request, res: express.Response) {
    res.render('absolute', {
        title: "Absolute"
    });
});
user.get('/relative', async function (req: express.Request, res: express.Response) {
    res.render('relative', {
        title: "Relative"
    });
});

user.post('/absolute', async function (req: express.Request, res: express.Response) {
    console.log(req.body, new Date(req.body.date));
    res.render('index', {
        title: "DayTracker",
        day: `${req.body?.date ? "That would be" : "Today is"} ${await getDay(Number(new Date(req.body?.date).getTime()), false)}`
    });
});
user.post('/relative', async function (req: express.Request, res: express.Response) {

    res.render('index', {
        title: "DayTracker",
        day: `${req.body?.date ? "That would be" : "Today is"} ${await getDay(Number(req.body?.date), true)}`
    });
});

user.get('/login', function (req: express.Request, res: express.Response) {
    res.render('/login', {});
});
user.post('/login', function (req: express.Request, res: express.Response) {
    if (req.header('key')) {
        const userKey = decodeKey(req.header('key'));

        if (req.header("key"))
            res.redirect("/user/dash");
        // res.render('dash.ejs', {
        //     name: "Jake"
        // });
    } else
        res.render("/login", {
            error: "Invalid User Key"
        });
});

export default user;
