import pool from './pool';
import {PoolClient} from "pg";

const client: PoolClient | Promise<PoolClient> = pool.User;

let userKeys: string[] = [];

export async function loadStack(): Promise<string[]> {
    const keys = (await (await client).query(`SELECT user_key
                                              from public.users`)).rows.map(i => i.user_key);

    userKeys = keys;

    return keys;
}

export default async function genKey(): Promise<string> {
    const key = [];

    const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,_-";

    do
        for (let i = 0; i < 256; i++)
            key.push(alphabet[Math.floor(Math.random() * alphabet.length - 1)]);
    while (userKeys.includes(key.join('')));

    userKeys.push(key.join(''));

    return key.join('');
}
