// External imports
var express = require("express")
const crypto = require("crypto")
const bodyParser = require("body-parser")
var router = express.Router()

router.use(bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf
    }
}))


router.post("/", (req, res, next) => {
   
    // const modifiedFiles = req.body.head_commit.modified
    const sigHeaderName = 'X-Hub-Signature-256'
    const sigHashAlg = 'sha256'

    const reqSign = req.get(sigHeaderName)


    const hmac = crypto.createHmac(sigHashAlg, req.rawBody)
    const digested = hmac.digest("hex")
    
    console.log(digested)
    console.log(reqSign)
    res.status(200).send()
    

})

export default router
