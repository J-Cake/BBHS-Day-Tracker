// app.use(function (req: express.Request, res: express.Response, next: express.NextFunction) { // simple logging
//     res.on('finish', function() {
//         const requestLog: string = [
//             `"${req.method.toUpperCase()}"`,
//             new Date().toLocaleString(),
//             req.path,
//             req.query ? Object.keys(req.query) : "-",
//             res.statusCode,
//             res.getHeader("content-type")].join(" ").trim();
//
//         console.log(requestLog);
//         fs.appendFileSync(path.join(process.cwd(), ".request.log"), requestLog + "\n", "utf8");
//     });
//
//     next();
// });