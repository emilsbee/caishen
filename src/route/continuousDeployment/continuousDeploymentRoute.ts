// External imports
var express = require("express")
const crypto = require("crypto")

var router = express.Router()


router.post("/", (req, res, next) => {
   
    // const modifiedFiles = req.body.head_commit.modified
    const sigHeaderName = 'X-Hub-Signature-256'
    const sigHashAlg = 'sha256'

    const reqSign = req.get(sigHeaderName)

    const strObj = JSON.stringify(req.body)

    const hmac = crypto.createHmac(sigHashAlg, strObj)
    const digested = hmac.digest("hex")
    
    console.log(digested)
    console.log(reqSign)
    res.status(200).send()
    

})

export default router
