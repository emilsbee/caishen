// External imports
import { validate } from "class-validator"
import { getRepository } from "typeorm"

// Internal imports
import { PaymentCategory } from "../entity/paymentCategory/paymentCategory"


/**
 * Middleware for populating the request body with an instance of PaymentCategory. The instance is either
 * found by the provided paymentCategoryName or paymentCategoryid, or a new instance is created based on the provided 
 * paymentCategoryName.
 * @param req 
 * @param res 
 * @param next 
 */
export async function extractOrCreatePaymentCategory (req, res, next) {
    let {paymentCategoryName, paymentCategoryid} = req.body

    // Checks if paymentCategoryName is provided
    if (paymentCategoryName && (typeof paymentCategoryName === "string") && paymentCategoryName.trim().length !== 0) {
    
        let paymentCategory:PaymentCategory
        try {
            paymentCategory = await getRepository(PaymentCategory).findOne({name: paymentCategoryName})
        } catch (e) {
            next({code: 500, message: "Failed to fetch payment category in payment category extraction middleware."})
        }

        // If a payment category exists with the given paymentCategoryName
        if (paymentCategory) {
            req.body["paymentCategory"] = paymentCategory
            next()

        // If a payment category with the given name doesn't exist, create it 
        } else {
            paymentCategory = new PaymentCategory()
            paymentCategory.name = paymentCategoryName

            // Validates the new payment category
            let errors: any[]
            try {
                errors = await validate(paymentCategory)
            } catch (e) {
                next({code: 500, message: "Internal error when validating a new payment category in payment category extraction middleware."})
            }

            if (errors.length > 0) {
                next({code: 400, message: "Failed to validate payment category in the payment category extraction middleware."})
            } else {

                // Saving the new payment category 
                let paymentCategoryRepository = getRepository(PaymentCategory)
                let newPaymentCategory:PaymentCategory

                try {
                    newPaymentCategory = await paymentCategoryRepository.save(paymentCategory)
                } catch(e) {
                    next({code: 500, message: "Failed to save a newly created payment category instance in payment category extraction middleware."})
                }

                req.body["paymentCategory"] = newPaymentCategory
                next()
            }
        }

    // Checks if paymentCategoryid is provided
    } else if (paymentCategoryid && (typeof paymentCategoryid === "string") && paymentCategoryid.trim().length !== 0) {
        let paymentCategory:PaymentCategory
        try {
            paymentCategory = await getRepository(PaymentCategory).findOne({id: paymentCategoryid})
        } catch(e) {
            next({code: 500, message: "Failed to find a payment category by paymentCategoryid in payment category extraction middleware. "})
        }

        // If a payment category exists with the given paymentCategoryid
        if (paymentCategory) {
            req.body["paymentCategory"] = paymentCategory
            next()
        } else {
            next({code: 400, message: "No payment category exists with the given id ["+paymentCategoryid+"] in payment category extraction middleware."})
        }

    // If no information about payment category is provided
    } else {
        next({code: 400,message: "You must provide a paymentCategoryName:string or paymentCategoryid:string to create a payment category."})
    }
}

