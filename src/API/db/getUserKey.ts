import pool from './pool';
import * as BCrypt from 'bcryptjs';

export default async function getUserKey(email: string, password: string): Promise<string> {
    const client = await pool.User;

    interface userQuery {
        userKey: string,
        password: string
    }

    const dbPass: userQuery = (function (query: any): userQuery {
        return {
            userKey: query.rows[0].user_key || "",
            password: query.rows[0].password || ""
        };
    })((await client.query(`SELECT *
                            FROM public."users"
                            WHERE "email" = $1`, [email])));

    if (dbPass.userKey && dbPass.password)
        if (BCrypt.compareSync(password, dbPass.password)) return dbPass.userKey;

    return null;
}
