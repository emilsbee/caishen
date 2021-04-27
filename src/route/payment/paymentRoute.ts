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
 * @param payeeName The name of the payee if doesn't exist, it is created.
 * @param paymentCategory The payment category if doesn't exist, it is created.
 * @param amount The amount, either positive or negative integer. 
 * @param accountid Accountid of the account that the payment is related to.
 * @param description The description of the payment.
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
            } 
            
            // Payee section
            let foundPayee = await transactionalEntityManager.find(Payee, {name: payeeName})
            let newPayee:Payee

            if (foundPayee.length === 0) {
                newPayee = new Payee()
                newPayee.name = payeeName

                let payeeErrors:any[]
                payeeErrors = await validate(newPayee)
                
                if (payeeErrors.length > 0) {
                    return next({code: 400, message: payeeErrors})
                } else {
                    await transactionalEntityManager.save(Payee, newPayee)
                }
            } 

            // Payment category section
            let foundPaymentCategory = await transactionalEntityManager.find(PaymentCategory, {name: paymentCategory})
            let newPaymentCategory:PaymentCategory

            if (foundPaymentCategory.length === 0) {
                newPaymentCategory = new PaymentCategory()
                newPaymentCategory.name = paymentCategory

                let paymentCategoryErrors:any[]
                paymentCategoryErrors = await validate(newPaymentCategory)

                if (paymentCategoryErrors.length > 0) {

                    return next({code: 400, message: paymentCategoryErrors})
                } else {
                    await transactionalEntityManager.save(PaymentCategory, newPaymentCategory)
                }
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
            
            if (foundPayee.length === 0) {
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
    const {accountid} = req.query
    
    if (!accountid) {
        next({code: 400, message: "You must provide an accountid."})
    }

    let paymentRepository = getRepository(Payment)
    
    try {
        let payments = await paymentRepository.find({where: {account: accountid}, order: {date: "DESC"}})
        // let payments = await getRepository(Payment).createQueryBuilder('payment').where("payment.account.id=:id", {id: accountid}).orderBy("payment.date", "DESC")
        res.status(200).json(payments)
    } catch (e) {
        next({code: 400, message: "Couldn't fetch payments."})

    }
})

router.put("/", async (req, res, next) => {
    let { 
        payeeName, 
        paymentCategory, 
        amount, 
        paymentid,
        description
    } = req.body

    try {
        await getManager().transaction("SERIALIZABLE", async transactionalEntityManager => {
            let payment = await transactionalEntityManager.find(Payment, {where: {id: paymentid}})
            
            if (payment.length !== 0) {

                // Payee section
                if (payeeName && payeeName.length !== 0) { // If payeeName present
                    let foundPayee = await transactionalEntityManager.find(Payee, {name: payeeName})
                    let newPayee:Payee
    
                    if (foundPayee.length === 0) {
                        newPayee = new Payee()
                        newPayee.name = payeeName
    
                        let payeeErrors:any[]
                        payeeErrors = await validate(newPayee)
                        
                        if (payeeErrors.length > 0) {
                            return next({code: 400, message: payeeErrors})
                        } else {
                            payment[0].payee = newPayee
                            await transactionalEntityManager.save(Payee, newPayee)
                        }
                    } else {
                        payment[0].payee = foundPayee[0]
                    }
                }

                // Amount section
                if (amount) {
                    payment[0].account.balance = payment[0].account.balance - payment[0].amount + amount
                    payment[0].amount = amount
                    await transactionalEntityManager.save(Account, payment[0].account)
                }

                // Payment category section
                if (paymentCategory && paymentCategory.length !== 0) {
                    let foundPaymentCategory = await transactionalEntityManager.find(PaymentCategory, {name: paymentCategory})
                    let newPaymentCategory:PaymentCategory
        
                    if (foundPaymentCategory.length === 0) {
                        newPaymentCategory = new PaymentCategory()
                        newPaymentCategory.name = paymentCategory
        
                        let paymentCategoryErrors:any[]
                        paymentCategoryErrors = await validate(newPaymentCategory)
        
                        if (paymentCategoryErrors.length > 0) {
                            return next({code: 400, message: paymentCategoryErrors})
                        } else {
                            payment[0].category = newPaymentCategory
                            await transactionalEntityManager.save(PaymentCategory, newPaymentCategory)
                        }
                    } else {
                        payment[0].category = foundPaymentCategory[0]
                    }
                }

                // Description section
                if (description && description.length !== 0) {
                    payment[0].description = description
                }

                // Payment section
                await transactionalEntityManager.save(Payment, payment[0])
                res.status(200).json(payment)
            } else {
                return next({code: 400, message: "You must provide a valid paymentid."})
            }

        })
    } catch (e) {
        next({code: 500, message: "Failed to complete payment creation transaction."})
    }
})

export default router
