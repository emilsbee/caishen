// External imports
var express = require("express")
var router = express.Router()
const crypto = require('crypto');


router.post("/", (req, res, next) => {
    const modifiedFiles = req.body.head_commit.modified
    
    const sigHeaderName = 'X-Hub-Signature-256'
    const sigHashAlg = 'sha256'

    const bufBody = Buffer.from(req.body)

    const sig = Buffer.from(req.get(sigHeaderName), 'utf8')
    const hmac = crypto.createHmac(sigHashAlg, process.env.GITHUB_WEBHOOK_SECRET)
    const digest = Buffer.from(sigHashAlg + '=' + hmac.update(bufBody.toString()).digest('hex'), 'utf8')
    
    
    if(sig.length !== digest.length || !crypto.timingSafeEqual(digest, sig)) {
        console.log("Invalid")
        next({code: 400, message:`Request body digest (${digest}) did not match ${sigHeaderName} (${sig})`})
    } else {
        console.log("Valid")
        res.status(200).send()
    }
    console.log("After")

})

export default router
