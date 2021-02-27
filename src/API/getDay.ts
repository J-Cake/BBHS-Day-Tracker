import * as fs from "fs";
import dataObj from "./data";
import setDay from "./setDay";
import getKeys, {keys} from './keys';
import getCurrentTime from './getCurrentTime';

const data: dataObj = JSON.parse(fs.readFileSync('./data.json', "utf8"));
const keys: keys = getKeys();

const daysBetween = function (date1: Date, date2: Date): number {   //Get 1 day in milliseconds
    const one_day: number = 1000 * 60 * 60 * 24;    // Convert both dates to milliseconds
    const date1_ms: number = date1.getTime();
    const date2_ms: number = date2.getTime();    // Calculate the difference in milliseconds
    const difference_ms: number = date2_ms - date1_ms;        // Convert back to days and return
    return Math.floor(difference_ms / one_day);
};

const betweenHoliday = function (date: Date): boolean {
    const lastStart: { start: number, end: number } = data.holidays.filter(i => i.start < date.getTime() && (i.end === -1 || i.end > date.getTime())).pop();

    return !!lastStart;
};

export default async function getDay(target?: number, relative?: boolean): Promise<string> {
    return data.dayCycle[await getDayNumber(target, relative)]
}

export async function getDetails(target?: number, relative?: boolean): Promise<[number, string]> {
    const number = await getDayNumber(target, relative);
    return [number, data.dayCycle[number]];
}

export async function getDayNumber(target?: number, relative?: boolean): Promise<number> {
    if (target && target < 0)
        throw {
            code: 400,
            message: "Please provide a positive value for `target`."
        };
    else if (target && !relative && daysBetween(new Date(await getCurrentTime()), new Date(target)) < 0)
        throw {
            code: 400,
            message: "Past dates are invalid."
        };

    const targetDate: Date = await (async function (): Promise<Date> {
        if (target)
            if (relative) {
                const date = new Date(await getCurrentTime());
                console.log(date.toLocaleDateString(), date.getDate());
                date.setDate(date.getDate() + target);

                return new Date(date);
            } else
                return new Date(target);
        else
            return new Date(await getCurrentTime());
        // new Date('Julia')
    })();

    let currentDate: Date = (function () { // use the last resetting holiday as a start point to reduce the workload
        const lastUpdated: Date = new Date(data.dateUpdated);

        const mostRecentHoliday = (function (): Date {
            if (data.restartCounterAfterHoliday === true)
                return new Date(data.holidays[data.holidays.length - 1].end);
            else if (data.restartCounterAfterHoliday instanceof Array)
                return (x => x ? new Date(x.end) : null)(data.holidays[data.restartCounterAfterHoliday[data.restartCounterAfterHoliday.length - 1]]);
        })();

        return mostRecentHoliday ? daysBetween(mostRecentHoliday, lastUpdated) > 0 ? mostRecentHoliday : lastUpdated : lastUpdated;
    })();

    let day: number = data.dayCycle.indexOf(data.day);

    while (daysBetween(currentDate, targetDate) > 0) {
        currentDate.setDate(currentDate.getDate() + 1);

        if (data.activeDays.includes(currentDate.getDay()))
            if (!betweenHoliday(currentDate))
                day = (day + 1) % data.dayCycle.length;
    }

    if (!target)
        setDay(data.dayCycle[day], keys.master);

    return day;
}

(async function () {
    const today = new Date(await getCurrentTime());
    today.setDate(today.getDate());
})();
