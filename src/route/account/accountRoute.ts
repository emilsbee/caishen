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
 * Request body must include iban: string, name: string, balance: number, type: string,
 * payments: Payment[], bunqid: number.
 */
router.post("/", async (req, res, next) => {

    const { iban, name, balance, type, payments, bunqid  } = req.body;

    let account = new Account()
    account.iban = iban
    account.name = name
    account.balance = balance
    account.type = type
    account.payments = payments
    account.bunqid = bunqid

    validate(account).then(async errors => {

        if (errors.length > 0) {
            
            next({code: 400, message: errors})
        } else {

            let accountRepository = getRepository(Account)
            let returnedAccount = await accountRepository.save(account)
        
            res.send(returnedAccount)
        }
    })

})

/**
 * Route for fetching single or multiple accounts. 
 * Request body must contain either a single on array of accountids.
 * @param {string} req.body.accountid the accountid of account being fetched. 
 */
router.get("/", async (req, res) => {
    
    const { accountid } = req.body

    let accountRepository = getRepository(Account)
    let account = await accountRepository.find({id: accountid})

    res.send(account)
})

export default router