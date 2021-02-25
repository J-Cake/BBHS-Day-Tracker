import * as http from "http";
import * as url from "url";
import * as fs from 'fs';
import * as path from 'path';
import * as querystring from "querystring";

import * as sourceMap from 'source-map-support';

import resolve, {headers} from "./resolver";
import start from "../start";

sourceMap.install();

const server = http.createServer(function (req, res) {
    const urlParsed: url.UrlObject = url.parse(req.url);
    if (typeof urlParsed.query === "string")
        urlParsed.query = querystring.parse(urlParsed.query);

    let response: string | { type: string, content: any };

    function write(data?: { code: number, type: string, body: any }) {
        if (data) {
            // const requestLog: string = [`"${req.method.toUpperCase()}"`, new Date().toLocaleString(), urlParsed.pathname, urlParsed.query ? Object.keys(urlParsed.query) : "-", data.code, data.type, data.body.constructor.name].join(" ").trim();
            // console.log(requestLog);
            // fs.appendFileSync(path.join(process.cwd(), ".request.log"), requestLog + "\n", "utf8");

            res.writeHead(data.code || 200, {
                "Content-type": data.type
            });
            res.end(data.body);
        } else {
            console.log("no response");
        }
    }

    try {
        response = resolve(urlParsed, req.headers as headers);
    } catch (err) {
        write({
            code: err.code,
            type: "application/json",
            body: JSON.stringify({
                code: err.code,
                message: err.message
            })
        });
        return;
    } finally {
        if (typeof response === "string")
            write({
                code: 200,
                type: "application/json",
                body: JSON.stringify({
                    code: 200,
                    message: response
                })
            });
        else if (response)
            write({
                code: 200,
                type: response.type,
                body: typeof response.content === "object" ? JSON.stringify(response.content) : response.content
            });
        else
            write({
                code: 200,
                type: "text/plain",
                body: "no data"
            });
    }
});

const port = 5492;

server.listen(port, function (): void {
    console.log("listening on port", port);
    console.warn("It is important to note that the calculator will get out of sync if the server is stopped, the date changes back and then restarted.");

    start();
});
