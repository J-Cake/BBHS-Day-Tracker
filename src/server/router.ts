import {Router} from 'express';
import getDay from "../API/getDay";
import setHoliday from "../API/setHoliday";
import setDay from "../API/setDay";
import userAPI from './userAPI';

const router = Router();

router.get('/get-day', async function (req, res) {
    try {
        const response = ((day: string) => ({
            friendly: `${req.query?.date ? "That would be" : "Today is"} ${day}`,
            raw: day,
            calculated: req.query && !!req.query?.date || false,
            relative: req.query && (req.query?.relative === "true") || false,
            offset: req.query?.date || null
        }))(await getDay(Number(req.query?.date), req.query?.relative === "true"));

        res.json(response);
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

router.use('/user', userAPI);

export default router;
