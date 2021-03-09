// External imports
var express = require("express")


// Internal imports
import {authenticateJWT} from "../middleware/authenticateJWT"
import {extractOrCreatePayee} from "../middleware/extractOrCreatePayee"
import { extractOrCreatePaymentCategory } from "../middleware/extractOrCreatePaymentCategory"

var router = express.Router()

router.get("/authenticate-jwt-test", authenticateJWT, (req, res, next) => {
    res.status(200).json()
})

router.get("/extract-or-create-payee", extractOrCreatePayee, (req, res, next) => {
    res.json({payee: req.body.payee})
})

router.get("/extract-or-create-payment-category", extractOrCreatePaymentCategory, (req, res, next) => {
    res.json({paymentCategory: req.body.paymentCategory})
})


export default router