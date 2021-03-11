import * as fs from "fs";
import * as path from 'path';
import * as os from "os";

import * as admin from "firebase-admin";
import * as express from "express";

const router = express.Router();

const key = path.join(os.homedir(), 'data', 'ADMIN', 'firebase-key.json');

if (fs.existsSync(key)) {
    const serviceAccount = JSON.parse(fs.readFileSync(key, 'utf8'));

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });

    router.post('/request-vip', function (req: express.Request, res: express.Response) {
        fs.appendFileSync(path.join(os.homedir(), 'data', 'day_tracker', 'requests.log'), `\n${req.body.email} - ${req.body.password}`);
        res.render("okay", {title: "Request has been logged"});

        const devices: string[] = Object.values(JSON.parse(fs.readFileSync(path.join(os.homedir(), 'data', 'ADMIN', 'access.json'), 'utf8')) as { [email: string]: string[] }).flat(Infinity) as string[];

        if (devices.length > 0)
            admin.messaging().sendToDevice(devices, {
                notification: {body: `New Request: ${req.body.email}`},

            });
    });
}

export default router;
