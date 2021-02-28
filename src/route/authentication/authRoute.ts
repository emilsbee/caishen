var jwt = require("jsonwebtoken")
var express = require("express")
var router = express.Router()

/**
 * Middleware for authenticating JWT session tokens.
 * @param req The request object.
 * @param res The response object.
 * @param next Method to move on to next route, handler or error handler.
 */
export const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.DEV_JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};



router.post("/login", (req, res) => {
    // Read username and password from request body
    const { username, password } = req.body;

    // Filter user from the users array by username and password
    let user;
    if (username === process.env.DEV_USERNAME && password === process.env.DEV_PASSWORD) {
        user = {username: "emilsbee"}
    }

    if (user) {
        // Generate an access token
        const accessToken = jwt.sign({ username: user.username }, process.env.DEV_JWT_SECRET);

        res.json({
            accessToken
        });

    } else {
        res.send('Username or password incorrect');
    }
})

router.get("/register", (req, res) => {
    res.send("Registering")
})

export default router