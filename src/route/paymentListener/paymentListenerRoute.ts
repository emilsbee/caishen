const fs = require('fs');

var express = require("express")
var router = express.Router()

router.post("/", (req, res, next) => {
    console.log(req.body)
    
    fs.writeFile("./bunq-payments.csv", JSON.stringify(req.body), function(err) {
        if (err) {
            next(err)
        } else {
            return res.send()
        }
    })

})

export default router