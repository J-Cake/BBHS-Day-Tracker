import * as express from 'express';
import {getDayNumber} from "../API/getDay";

const router = express.Router();

router.use(async function (req: express.Request, res: express.Response, next: express.NextFunction) {
    if (req.info)
        return next();
    res.status(401);
    res.end('Not registered');
});

router.get('/timetable', async function (req: express.Request, res: express.Response) {
    res.json(req.info.timetable);
});

router.get('/getSubjects', async function (req: express.Request, res: express.Response) {
    const [info, isWeekday] = await getDayNumber(Number(req.query?.date), req.query?.relative === "true");

    // console.log(req.info.timetable[info]);

    res.json(isWeekday ? req.info.timetable[info] : []);
});

export default router;
