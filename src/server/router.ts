import * as express from 'express';
import {Router} from 'express';
import getDay from "../API/getDay";
import setHoliday from "../API/setHoliday";
import setDay from "../API/setDay";
import userAPI from './userAPI';

const router = Router();

router.use('/user', userAPI);

router.get('/get-day', async function (req, res) {
    try {
        if ('presentation' in req.query) {
            if (req.query.presentation === 'friendly')
                res.end(`${req.query?.date ? "That would be" : "Today is"} ${await getDay(Number(req.query?.date), req.query?.relative === "true")}`);
            else if (req.query.presentation === 'raw')
                res.end(await getDay(Number(req.query?.date), req.query?.relative === "true"));
        } else {
            const response = ((day: string) => ({
                friendly: `${req.query?.date ? "That would be" : "Today is"} ${day}`,
                raw: day,
                calculated: req.query && !!req.query?.date || false,
                relative: req.query && (req.query?.relative === "true") || false,
                offset: req.query?.date || null
            }))(await getDay(Number(req.query?.date), req.query?.relative === "true"));

            res.json(response);
        }
    } catch (err) {
        res.status(err.code);
        res.json({ok: false, message: err.message});
    }
});

router.get("/set-day", function (req, res) {
    const {day}: { day: string } = req.query as any;
    const {key}: { key: string } = req.headers as any;

    res.json(setDay(day, key));
});

router.get('/holiday', async function (req, res) {
    const {active, reset}: { active: string, reset: string } = req.query as any;
    const {key}: { key: string } = req.headers as any;

    res.json(await setHoliday(active === "true", reset === "true", key));
});

router.use(async function (req: express.Request, res: express.Response) {
    res.status(404);
    res.end('Error 404: Endpoint Not Found');
})

export default router;
