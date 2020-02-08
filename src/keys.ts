import * as fs from 'fs';
import * as path from "path";

export interface keys {
    master: string

    [key: string]: string,
}

export function isValidKey(key: string): boolean {
    const keys: keys = getKeys();

    return Object.values(keys).includes(key);
}

export default function getKeys(): keys {
    const file: string[] = fs.readFileSync(path.join(process.cwd(), ".allowedCodes.txt"), "utf8").split("\n");

    const keys: keys = {
        master: ""
    };

    for (const line of file) if (line) {
        const key = line.split(":");

        keys[key[0].trim()] = key[1].trim();
    }

    return keys;
}