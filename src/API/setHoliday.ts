import * as fs from "fs";
import dataObj from "./data";
import {isValidKey} from "./keys";
import getCurrentTime from "./getCurrentTime";

const data: dataObj = JSON.parse(fs.readFileSync('./data.json', "utf8"));

export default async function (holidayActive: boolean, reset: boolean = false, accessCode: string): Promise<string> {
    if (isValidKey(accessCode)) {// confirm code validity
        data.isHoliday = holidayActive;

        if (holidayActive) {
            data.holidays.push({
                start: new Date(await getCurrentTime()).getTime(),
                end: -1
            });

            if (typeof data.restartCounterAfterHoliday === "boolean")
                data.restartCounterAfterHoliday = reset;
            else if (reset === true)
                data.restartCounterAfterHoliday.push(data.holidays.length - 1);
        } else
            data.holidays[data.holidays.length - 1].end = new Date(await getCurrentTime()).getTime();

        data.dateUpdated = Date.now();

        try {
            fs.writeFileSync("./data.json", JSON.stringify(data), "utf8");
        } catch (err) {
            throw {code: 500, message: err.message};
        }

        return "";
    } else
        throw {
            code: 403,
            message: `You do not have the correct permission to change this setting`
        };
}
