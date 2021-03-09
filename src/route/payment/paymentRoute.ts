// External imports
import {getRepository} from "typeorm"
import {validate} from "class-validator"
var express = require("express")
var router = express.Router()

// Internal imports
import { Payment } from "../../entity/payment/payment"
import { Payee } from "../../entity/payee/payee"
import {extractOrCreatePayee} from "../../middleware/extractOrCreatePayee"


/**
 * Route for creating a new payment.
 */
router.post("/", extractOrCreatePayee, async (req, res, next) => {
    res.json({message: "Creating a payment"})
})

router.get("/", (req, res) => {
    res.json({payment: "Returning single payment"})
})

router.get("/batch", (req, res) => {
    res.json({payments: "Returning a batch of payments"})
})

export default router
