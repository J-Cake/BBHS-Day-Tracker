import * as fs from "fs";
import * as path from "path";
import * as os from "os";

import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as bcrypt from 'bcryptjs';
import * as bodyParser from "body-parser";

const router = express.Router();

export interface Info {
    email: string,
    password: string,
    timetable: [
        [string, string, string, string],
        [string, string, string, string],
        [string, string, string, string],
        [string, string, string, string],
        [string, string, string, string],
        [string, string, string, string],
        [string, string, string, string],
    ],
}

router.use(cookieParser());
router.use(bodyParser.urlencoded({extended: true}))

router.post('/login', function (req: express.Request, res: express.Response) {
    const userInfo: { [userToken: string]: Info } = JSON.parse(fs.readFileSync(path.join(os.homedir(), 'data', 'day_tracker', 'users.json'), 'utf8'));

    console.log(userInfo, req.body);

    for (const i in userInfo)
        if (userInfo[i].email === req.body.email && bcrypt.compare(userInfo[i].password, req.body.password)) {
            res.cookie('token', i);
            res.redirect('/');
            return;
        }

    res.status(403);
    res.redirect('/login');
});

router.get("/timetable", function (req: express.Request, res: express.Response) {
    console.log(req.info.timetable);
    if (req.info)
        res.render('timetable', {title: "Timetable", timetable: req.info.timetable});
    else
        res.redirect('/login');
});

export default router;

// User token => email hashed with 1 round of salt
// Hashed password => password hashed with 10 round of salt
