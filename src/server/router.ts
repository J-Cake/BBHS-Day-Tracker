import {Router} from 'express';
import getDay from "./getDay";
import setHoliday from "./setHoliday";
import setDay from "./setDay";

const router = Router();

router.get('/get-day', function(req, res) {
    res.json(((day: string) => ({
        friendly: `${req.query?.date ? "That would be" : "Today is"} ${day}`,
        raw: day,
        calculated: req.query && !!req.query?.date || false,
        relative: req.query && (req.query?.relative === "true") || false,
        offset: req.query?.date || null
    }))(getDay(Number(req.query?.date), req.query?.relative === "true")))
});


router.get("/set-day", function (req, res) {
    const {day}: { day: string } = req.query as any;
    const {key}: {key: string} = req.headers as any;

    res.json(setDay(day, key));
});

router.get('/holiday', function(req, res) {
    const {active, reset}: { active: string, reset: string } = req.query as any;
    const {key}: {key: string} = req.headers as any;

    res.json(setHoliday(active === "true", reset === "true", key));
});

export default router;