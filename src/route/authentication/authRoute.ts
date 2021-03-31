var jwt = require("jsonwebtoken")
var express = require("express")
var router = express.Router()

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
        res.json('Username or password incorrect');
    }
})

router.get("/register", (req, res) => {
    res.json("Registering")
})

export default router