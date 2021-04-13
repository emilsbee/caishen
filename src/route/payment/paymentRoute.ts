// External imports
import {getManager, getRepository} from "typeorm"
import {validate} from "class-validator"
var express = require("express")

// Internal imports
import { Payment } from "../../entity/payment/payment"
import { Payee } from "../../entity/payee/payee"
import { PaymentCategory } from "../../entity/paymentCategory/paymentCategory"
import { Account } from "../../entity/account/account"

var router = express.Router()

/**
 * Route for creating a new payment.
 */
router.post("/", async (req, res, next) => {
    let { 
        payeeName, 
        paymentCategory, 
        amount, 
        accountid,
        description
    } = req.body

    try {
        await getManager().transaction("SERIALIZABLE",async transactionalEntityManager => {
            let newPayment = new Payment()

            // Account section
            let foundAccount = await transactionalEntityManager.find(Account, {id: accountid})
            if (foundAccount.length === 0) {
                return next({code: 400, message: "You must provide a valid accountid."})
            } else {
                await transactionalEntityManager.save(Account,{id: accountid, payments: [newPayment]})
            }
            
            // Payee section
            let foundPayee = await transactionalEntityManager.find(Payee, {name: payeeName})
            let newPayee:Payee

            if (foundPayee.length === 0) {
                newPayee = new Payee()
                newPayee.name = payeeName
                newPayee.payments = [newPayment]

                let payeeErrors:any[]
                payeeErrors = await validate(newPayee)
                
                if (payeeErrors.length > 0) {
                    return next({code: 400, message: payeeErrors})
                } else {
                    await transactionalEntityManager.save(Payee, newPayee)
                }
            } else {
                await transactionalEntityManager.save(Payee, {id: foundPayee[0].id, payments: [newPayment]})
            }

            // Payment category section
            let foundPaymentCategory = await transactionalEntityManager.find(PaymentCategory, {name: paymentCategory})
            let newPaymentCategory:PaymentCategory

            if (foundPaymentCategory.length === 0) {
                newPaymentCategory = new PaymentCategory()
                newPaymentCategory.name = paymentCategory
                newPaymentCategory.payments = [newPayment]

                let paymentCategoryErrors:any[]
                paymentCategoryErrors = await validate(newPaymentCategory)

                if (paymentCategoryErrors.length > 0) {

                    return next({code: 400, message: paymentCategoryErrors})
                } else {
                    await transactionalEntityManager.save(PaymentCategory, newPaymentCategory)
                }
            } else {
                await transactionalEntityManager.save(PaymentCategory, {id: foundPaymentCategory[0].id, payments: [newPayment]})
            }

            
            // New payment section
            newPayment.account =  foundAccount[0]
            
            newPayment.amount = amount
            
            if (newPaymentCategory) {
                newPayment.category = newPaymentCategory
            } else {
                newPayment.category = foundPaymentCategory[0]
            }

            newPayment.currency = foundAccount[0].currency
            
            newPayment.description = description
            
            if (newPayee) {
                newPayment.payee = newPayee
            } else {
                newPayment.payee = foundPayee[0]
            }
            
            let newPaymentErrors = await validate(newPayment)
            
            if (newPaymentErrors.length > 0) {
                return next({code: 400, message: newPaymentErrors})
            } else {
                await transactionalEntityManager.save(Payment, newPayment)
                
                let payment = await transactionalEntityManager.getRepository(Payment).find({id: newPayment.id})
                res.status(201).json(payment)
            }
        })

    } catch (e) {
        console.log(e)
        next({code: 500, message: "Failed to complete payment creation transaction."})
    }
})


router.get("/", (req, res) => {
    res.json({payment: "Returning single payment"})
})

/**
 * Get all payments for a given account.
 * @param accountid The accountid of account from which to fetch payments.
 */
router.get("/all", async (req, res, next) => {
    const {accountid} = req.body

    if (!accountid) {
        next({code: 400, message: "You must provide an accountid."})
    }

    let paymentRepository = getRepository(Payment)
    
    try {
        let payments = await paymentRepository.find({where: {account: req.body.accountid}})
        res.status(200).json(payments)
    } catch (e) {
        next({code: 400, message: "Couldn't fetch payments."})

    }
})

export default router
