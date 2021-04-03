// External imports
var express = require("express")
var router = express.Router()
const crypto = require('crypto')


router.use(function(req, res, next) {
    req.rawBody = '';
    req.setEncoding('utf8');
  
    req.on('data', function(chunk) { 
      req.rawBody += chunk;
    });
  
    req.on('end', function() {
      next();
    });
  });

router.post("/", (req, res, next) => {
    const modifiedFiles = req.body.head_commit.modified
    console.log("Before", req.rawBody)
    const sigHeaderName = 'X-Hub-Signature-256'
    const sigHashAlg = 'sha256'

    const sig = Buffer.from(req.get(sigHeaderName), 'utf8')
    const hmac = crypto.createHmac(sigHashAlg, process.env.GITHUB_WEBHOOK_SECRET)
    const digest = Buffer.from(sigHashAlg + '=' + hmac.update(req.rawBody).digest('hex'), 'utf8')
    
    
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
