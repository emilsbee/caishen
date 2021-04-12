// External imports
var express = require("express")

// Internal imports
import {authenticateJWT} from "../middleware/authenticateJWT"

var router = express.Router()

router.get("/authenticate-jwt-test", authenticateJWT, (req, res, next) => {
    res.status(200).json()
})

export default router