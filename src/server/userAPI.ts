import {Router} from 'express';
// import {APIResponse, APISuccessCode} from '../API/API';
// import getUserKey from "../API/db/getUserKey";

const router = Router();

router.post("/request-login-key", async function (req, res) {
    // const email: string = req.body.email;
    // const password: string = req.body.password;
    //
    // const body: APIResponse = {
    //     code: APISuccessCode.processing
    // };
    //
    // if (/.[^.]+@.[^.]+(\..[^.]+)+/.test(email) && password.length >= 6) {
    //     const userId = await getUserKey(email, password);
    //
    //     if (userId !== null)
    //         body.body = userId;
    //     else {
    //         body.body = "The email and password don't match";
    //         body.code = APISuccessCode.loginDenied
    //     }
    //
    //     res.json(body);
    // } else {
    //     body.code = APISuccessCode.loginDenied;
    //     body.body = "Login Failed.";
    //
    //     res.status(403);
    //     res.json(body);
    // }
    res.status(501);
    res.end("Unimplemented");
});

export default router;
