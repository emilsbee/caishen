// External imports
var express = require("express")
var router = express.Router()
const { Webhooks, createNodeMiddleware } = require("@octokit/webhooks");


const webhooks = new Webhooks({
  secret: process.env.GITHUB_WEBHOOK_SECRET,
});

router.post("/", (req, res, next) => {
    let signature = webhooks.sign(req.body);
    let verified = webhooks.verify(req.body, signature);

    if (verified) {
        console.log("Valid!")
    } else {
        console.log("Invalid")
    }
})

export default router
