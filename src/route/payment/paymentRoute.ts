// External imports
import {getRepository} from "typeorm"
import {validate} from "class-validator"
var express = require("express")
var router = express.Router()

// Internal imports
import { Payment } from "../../entity/payment/payment"
import { Payee } from "../../entity/payee/payee"
import {payeeMiddleware} from "../../middleware/extractPayee"

/**
 * Route for creating a new payment.
 */
router.post("/", payeeMiddleware, async (req, res, next) => {
    console.log(req.body.payee)
    res.send("200")
})

router.get("/", (req, res) => {
    res.send("Returning single payment")
})

router.get("/batch", (req, res) => {
    res.send("Returning a batch of payments")
})

export default router










































    // // Checks if payeeName is provided
    // if (payeeName && (typeof payeeName === "string") && payeeName.trim().length !== 0) {
        
    //     getRepository(Payee).findOne({name: payeeName}).then(payee => {
            
    //         // If a payee exist with the given payeeName
    //         if (payee) {
    //             payeeInstance = payee
    //             console.log(payeeInstance+"hererere")
    //         } else {
                
    //             payee = new Payee()
    //             payee.name = payeeName
    //             validate(payee).then(errors => {

    //                 if (errors.length > 0) {
            
    //                     next({code: 400, message: "Failed to validate a new payee with the given name ["+payeeName+"] in post payment/ route."})
            
    //                 } else {
            
    //                     let payeeRepository = getRepository(Payee)
    //                     payeeRepository.save(payee).then(newPayee => {
    //                         payeeInstance = newPayee
    //                     }).catch(e => next({code: 500, message: "Failed to save a newly created payee in post payment/ route."}))
                    
    //                 }

                    
    //             }).catch(e => next({code: 500, message: "Failed to validate a new payee instance in post payment/ route."}))
    //         }

    //     }).catch(e => next({code:500, message: "Failed to fetch payee in post payment/ route."}))

    // // Checks if payeeid is provided
    // } else if (payeeid && (typeof payeeName == "string") && payeeName.trim().length !== 0) {

    //     getRepository(Payee).findOne({id: payeeid}).then(payee => {

    //         // If a payee exist with the given payeeid
    //         if (payee) {
    //             payeeInstance = payee
    //         } else {
    //             next({code: 400, message: "No payee exist with the given id ["+payeeid+"] in post payment/ route."})
    //         }
    //     })

    // // If no information about payee is provided
    // } else {
    //     next({code: 400,message: "You must provide a payeeName:string or payeeid:string to create a payment."})
    // }