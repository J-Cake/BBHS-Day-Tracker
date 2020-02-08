import * as fs from "fs";
import dataObj from "./data";
import {isValidKey} from './keys';

const data: dataObj = JSON.parse(fs.readFileSync('./data.json', "utf8"));

export default function (day: string, accessCode: string): string {
    if (isValidKey(accessCode)) {// confirm code validity
        if (data.dayCycle.includes(day)) {
            data.day = day;
            data.dateUpdated = Date.now();

            try {
                const file = JSON.stringify(data, null, 4);
                fs.writeFileSync('./data.json', file, 'utf8');
            } catch (err) {
                throw {code: 500, message: "Update failed"};
            }
        } else
            throw {
                code: 400,
                message: `The specified day is not part of the cycle. Please specify one of ${data.dayCycle.join()}`
            };

        return "Update Successful";
    } else
        throw {
            code: 403,
            message: `You do not have the correct permission to change this setting`
        };
}
