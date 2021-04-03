// External imports
var express = require("express")
var router = express.Router()
const crypto = require('crypto')


router.post("/", (req, res, next) => {
    const modifiedFiles = req.body.head_commit.modified

    const sigHeaderName = 'X-Hub-Signature-256'
    const sigHashAlg = 'sha256'

    const signature = req.get(sigHeaderName)
    const hmac = crypto.createHmac(sigHashAlg, process.env.GITHUB_WEBHOOK_SECRET)
    const digest = sigHashAlg + "=" + hmac.update(JSON.stringify(req.body)).digest("hex")

    if(signature.length !== digest.length || !crypto.timingSafeEqual(digest, signature)) {
        console.log("Invalid")
        next({code: 400, message:`Request body digest (${digest}) did not match ${sigHeaderName} (${signature})`})
    } else {
        console.log("Valid")
        res.status(200).send()
    }


})

export default router
