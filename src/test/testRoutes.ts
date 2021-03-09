var express = require("express")

import {authenticateJWT} from "../middleware/authenticateJWT"
import {extractOrCreatePayee} from "../middleware/extractOrCreatePayee"

var router = express.Router()

router.get("/authenticate-jwt-test", authenticateJWT, (req, res, next) => {
    res.status(200).json()
})

router.get("/extract-or-create-payee", extractOrCreatePayee, (req, res, next) => {
    res.json({payee: req.body.payee})
})



export default router