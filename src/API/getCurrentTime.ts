import * as needle from 'needle';

interface WorldTimeAPIResponse {
    week_number: number,
    utc_offset: string,
    utc_datetime: string,
    unixtime: number,
    timezone: string,
    raw_offset: number,
    dst_until: string,
    dst_offset: number,
    dst_from: string,
    dst: boolean,
    day_of_year: number,
    day_of_week: number,
    datetime: string,
    client_ip: string,
    abbreviation: string
}

export default async function getCurrentTime(): Promise<number> {
    const res: WorldTimeAPIResponse = (await needle('get', 'worldtimeapi.org/api/timezone/Australia/Sydney', {json: true})).body;

    return res.unixtime * 1000; // doesn't include milliseconds
}
