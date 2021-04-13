// External imports
import {getManager, getRepository} from "typeorm"
import {validate} from "class-validator"
var express = require("express")

// Internal imports
import { Account } from "../../entity/account/account";

var router = express.Router()

/**
 * Route for creating an account.
 * @param {string} iban the iban of account being created. 
 * @param {string} name the name of account being created.
 * @param {string} type the type of account: crypto, cash or bank.
 * @param {string} currency the currency of account.
 */
router.post("/", async (req, res, next) => {

    const { iban, name, type, currency, description, id } = req.body;

    try {
        await getManager().transaction("SERIALIZABLE",async transactionalEntityManager => {
            let account = new Account()
            if (id) {
                account.id = id
            }
            account.iban = iban ? iban : null
            account.name = name
            account.type = type
            account.currency = currency
            account.description = description
        
            validate(account).then(async errors => {
        
                if (errors.length > 0) {
                    return next({code: 400, message: errors})
                } else {
                    let accountRepository = transactionalEntityManager.getRepository(Account)
                    let returnedAccount:Account
                    try {
                        returnedAccount = await accountRepository.save(account)
                    } catch (e) {
                        return next({code: 400, message: "Couldn't save the account."})
                    }
                    res.status(201).json([returnedAccount])
                }
            })
        })
    } catch (e) {
        next({code: 500, message: "Failed to complete account creation transaction."})
    }

    

})

/**
 * Route for deleting a given account by an id. 
 * @param {string} accountid The id of account to delete.
 */
router.delete("/", async (req, res, next) => {
    const { accountid } = req.body

    let accountRepository = getRepository(Account)

    try {
        let account = await accountRepository.find({id: accountid})

        if (account.length > 0) {
            await accountRepository.remove(account[0])
            res.status(200).json(account)
        } else {
            next({code: 404, message: "Couldn't delete the account."})
        }
        
    } catch (e) {
        next({code: 500, message: "Couldn't delete the given account."})

    }
})

/**
 * Route for fetching all accounts.
 * @return {AccountType[]} An array that is either empty or contains the account objects.
 */
router.get("/all", async (req, res) => {

    let accountRepository = getRepository(Account)

    try {
        let accounts = await accountRepository.find()
        res.status(200).json(accounts)
    } catch (e) {
        res.next({code: 500, message: "Couldn't fetch accounts."})

    }

})

/**
 * Route for fetching single account by given id. 
 * Request body must contain an accountid.
 * @param {string} req.body.accountid the accountid of account being fetched. 
 * @return {AccountType[]} An array that is either empty or contains the account object.
 */
router.get("/", async (req, res, next) => {
    
    const { accountid } = req.body
    
    if (!accountid) {
        next({code: 400, message: "No accountid provided."})
    }

    let accountRepository = getRepository(Account)

    try {
        let account = await accountRepository.find({id: accountid})
        
        res.status(200).json(account)
    } catch (e) {
        next({code: 500, message: "Couldn't fetch account."})
    }

})

export default router