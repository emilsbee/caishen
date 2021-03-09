// External imports
import { validate } from "class-validator"

import { getRepository } from "typeorm"

// Internal imports
import { Payee } from "../entity/payee/payee"



/**
 * Middleware for populating the request body with an instance of Payee. The instance is either
 * found by the provided payeeName or payeeid, or a new instance is created based on the provided 
 * payeeName.
 * @param req 
 * @param res 
 * @param next 
 */
export async function extractOrCreatePayee (req, res, next) {
    let {payeeName, payeeid} = req.body
    
    // Checks if payeeName is provided
    if (payeeName && (typeof payeeName === "string") && payeeName.trim().length !== 0) {
        
        let payee:Payee;
        try {
            payee = await getRepository(Payee).findOne({name: payeeName})
        } catch (e) {
            next({code:500, message: "Failed to fetch payee in payee extraction middleware."})
        }

        // If a payee exist with the given payeeName
        if (payee) {
            req.body["payee"] = payee
            next()

        // If a payee with the given name doesn't exist, create it
        } else {
            payee = new Payee()
            payee.name = payeeName
            
            // Validates the new payee
            let errors: any[]
            try {
                errors = await validate(payee)
            } catch (e) {
                next({code: 500, message: "Failed to validate a new payee instance in payee extraction middleware."})
            }
            
            if (errors.length > 0) {
                next({code: 400, message: "Failed to validate a new payee with the given name ["+payeeName+"] in payee extraction middleware."})
            } else {
                
                // Saving the new payee
                let payeeRepository = getRepository(Payee)
                let newPayee:Payee;

                try {
                    newPayee = await payeeRepository.save(payee)
                } catch (e) {
                    next({code: 500, message: "Failed to save a newly created payee in payee extraction middleware."})
                }
                    
                req.body["payee"] = newPayee
                next()
            }
        }

    // Checks if payeeid is provided
    } else if (payeeid && (typeof payeeid === "string") && payeeid.trim().length !== 0) {
        let payee:Payee;
        try {
            payee = await getRepository(Payee).findOne({id: payeeid})
        } catch (e) {
            next({code: 500, message: "Failed to find a payee by payeeid in payee extraction middleware."})
        }

        // If a payee exists with the given payeeid
        if (payee) {
            req.body["payee"] = payee
            next()
        } else {
            next({code: 400, message: "No payee exists with the given id ["+payeeid+"] in payee extraction middleware."})
        }

    // If no information about payee is provided
    } else {
        next({code: 400,message: "You must provide a payeeName:string or payeeid:string to create a payment."})
    }
}

