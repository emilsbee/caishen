var express = require("express")

import {authenticateJWT} from "../authenticateJWT"

var router = express.Router()

router.get("/", authenticateJWT,async (req, res, next) => {
    res.status(200).send()
})

export default router