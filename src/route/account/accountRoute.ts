// External imports
import {getRepository} from "typeorm"
import {validate} from "class-validator"
var jwt = require("jsonwebtoken")
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

    const { iban, name, type, currency } = req.body;

    let account = new Account()
    account.iban = iban ? iban : null
    account.name = name
    account.type = type
    account.currency = currency

    validate(account).then(async errors => {

        if (errors.length > 0) {
            
            next({code: 400, message: errors})
        } else {

            let accountRepository = getRepository(Account)
            let returnedAccount:Account
            try {
                returnedAccount = await accountRepository.save(account)
            } catch (e) {
                next({code: 400, message: "Couldn't save the account."})
            }
        
            res.json("returnedAccount")
        }
    })

})

/**
 * Route for deleting a given account by an id. 
 * @param {string} accountid The id of account to delete.
 */
router.delete("/", async (req, res, next) => {
    const { accountid } = req.body

    let accountRepository = getRepository(Account)

    try {
        await accountRepository.delete(accountid)
        res.status(202).send()
    } catch (e) {
        res.next({code: 500, message: "Couldn't delete the given account."})

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
        res.json(accounts)
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
router.get("/", async (req, res) => {
    
    const { accountid } = req.body

    let accountRepository = getRepository(Account)

    try {
        let account = await accountRepository.find({id: accountid})
        res.json(account)
    } catch (e) {
        res.next({code: 500, message: "Couldn't fetch account."})
    }

})

export default router