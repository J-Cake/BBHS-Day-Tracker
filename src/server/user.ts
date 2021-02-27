import * as fs from "fs";
import * as path from "path";
import * as os from "os";

import * as express from 'express';

import {getDetails} from "../API/getDay";
import secure, {Info} from "./secure";
import notifier from "./notifier";

const user = express.Router();

declare module 'express' {
    export interface Request {
        info?: Info
    }
}

export function friendly(day: string, calculated: boolean, weekday: boolean): string {
    if (calculated)
        if (weekday)
            return `That's ${day}`;
        else
            return `Nothing that day, but the last day was ${day}`;
    else if (weekday)
        return `Today is ${day}`;
    else
        return `There's nothing on today. The last day was ${day}`;
}

export async function tracker(req: express.Request, res: express.Response, relative: boolean = false) {
    try {
        const [dayNumber, day, isWeekday, date] = await getDetails(typeof req.body?.date === "string" ? new Date(req.body.date).getTime() : Number(req.body?.date), relative);

        res.render('index', {
            title: "DayTracker",
            day: friendly(day, !!req.body?.date, isWeekday),
            date: date,
            today: req.info ? req.info.timetable[dayNumber] : null
        });
    } catch (err) {
        const [dayNumber, day, isWeekday] = await getDetails();

        res.render('index', {
            title: "DayTracker",
            day: friendly(day, !!req.body?.date, isWeekday),
            error: 'Invalid calculation',
            today: req.info ? req.info.timetable[dayNumber] : null
        })
    }
}

user.get('/', async function (req: express.Request, res: express.Response) {
    await tracker(req, res);
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

user.post(['/absolute', '/relative'], async function (req: express.Request, res: express.Response) {
    await tracker(req, res, req.path === '/relative');
});

user.get('/login', function (req: express.Request, res: express.Response) {
    res.render('login', {title: "Log In"});
})

user.get('/logout', function (req: express.Request, res: express.Response) {
    res.clearCookie('token');
    res.redirect('/');
});

user.get('/request-vip', function (req: express.Request, res: express.Response) {
    res.render('request-vip', {
        title: "Request account"
    })
});

user.get('/admin', function (req: express.Request, res: express.Response) {
    const allowedEmails = JSON.parse(fs.readFileSync(path.join(os.homedir(), 'data', 'ADMIN', 'access.json'), 'utf8'));
    // const allowedEmails = fs.readFileSync(path.join(os.homedir(), 'data', 'ADMIN', 'accessible_email'), 'utf8').split('\n').map(i => i.split(';')[0].trim()).filter(i => /^([\w.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/.test(i));

    if (req.info.email in allowedEmails)
        res.render('admin', {title: "Admin"});
    else {
        res.status(404);
        res.render('404', {title: 'Not Found'});
    }
});

user.put('/admin/saveToken', function (req: express.Request, res: express.Response) {
    const allowedEmails = JSON.parse(fs.readFileSync(path.join(os.homedir(), 'data', 'ADMIN', 'access.json'), 'utf8'));
    if (req.info)
        if (req.info.email in allowedEmails) {
            allowedEmails[req.info.email].push(req.query.token);
            fs.writeFileSync(path.join(os.homedir(), 'data', 'ADMIN', 'access.json'), JSON.stringify(allowedEmails), 'utf8');
            return;
        }
    res.status(404);
    res.render('404', {title: 'Not Found'});
});

user.use(secure);
user.use(notifier);

user.use(function (req: express.Request, res: express.Response) {
    res.status(404);
    res.render('404', {title: 'Not Found'});
});

export default user;
