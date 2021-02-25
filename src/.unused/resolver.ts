import * as url from 'url';
import * as fs from 'fs';
import * as path from "path";

import getDay from "../getDay";
import setHoliday from "../setHoliday";
import setDay from "../setDay";

type params = {
    date?: string,
    relative?: string,
    day: string,
    reset: string,
    active: string
} | null;

export type headers = {
    key?: string
} | null;

export default function (url: url.UrlObject, head: headers): string | { type: string, content: any } {
    const params: params = url.query as params;
    const headers: headers = head;

    switch (url.pathname.toLowerCase()) {
        case "/css/colours.css":
            return {
                type: "text/css",
                content: fs.readFileSync(path.join(process.cwd(), "public", "css", "colours.css"), "utf8")
            };
        case '/':
            return {
                type: "text/html",
                content: fs.readFileSync(path.join(process.cwd(), "public", "index.html"), "utf8")
            };
        case "/css/master.css":
            return {
                type: "text/css",
                content: fs.readFileSync(path.join(process.cwd(), "public", "css", "master.css"), "utf8")
            };
        case "/js/index.js":
            return {
                type: "text/javascript",
                content: fs.readFileSync(path.join(process.cwd(), "public", "js", "index.js"), "utf8")
            };
        case '/login.html':
            return {
                type: "text/html",
                content: fs.readFileSync(path.join(process.cwd(), "public/login.html"), "utf8")
            };
        case '/get-day':
            return {
                type: "application/json",
                content: ((day: string) => ({
                    friendly: `${params?.date ? "That would be" : "Today is"} ${day}`,
                    raw: day,
                    calculated: params && !!params?.date || false,
                    relative: params && (params?.relative === "true") || false,
                    offset: params?.date || null
                }))(getDay(Number(params?.date), params?.relative === "true"))
            };
        case '/holiday':
            const {active, reset}: { active: string, reset: string } = url.query as any;
            return setHoliday(active === "true", reset === "true", headers.key);
        case '/set-day':
            const {day}: { day: string } = url.query as any;

            return setDay(day, headers.key);
        default:
            throw {code: 404, err: new Error(`The method, ${url.pathname.toLowerCase()}, does not exist`)};
    }
}
