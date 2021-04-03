// External imports
var express = require("express")
var router = express.Router()
const crypto = require('crypto')

router.post("/", (req, res, next) => {
    const modifiedFiles = req.body.head_commit.modified

    const sigHeaderName = 'X-Hub-Signature-256'
    const sigHashAlg = 'sha256'

    // const sig = Buffer.from(req.get(sigHeaderName) || '', 'utf8')
    // const hmac = crypto.createHmac(sigHashAlg, process.env.GITHUB_WEBHOOK_SECRET)
    // const digest = Buffer.from(sigHashAlg + '=' + hmac.update(req.rawBody).digest('hex'), 'utf8')
    
    // if (sig.length !== digest.length || !crypto.timingSafeEqual(digest, sig)) {
    //     // next({code: 400, message:`Request body digest (${digest}) did not match ${sigHeaderName} (${sig})`})
    //     console.log("Invalid")
    //     res.status(200).send()
    // } else {
    //     console.log("Valid")
    // }
    console.log(req.get(sigHeaderName))

    res.status(200).send()

})

export default router
