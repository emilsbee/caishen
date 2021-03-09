const fs = require('fs');

var express = require("express")
var router = express.Router()

router.post("/", (req, res, next) => {
   
    
    fs.writeFile("./bunq-payments.csv", JSON.stringify(req.body), function(err) {
        if (err) {
            next(err)
        } else {
            return res.json()
        }
    })

})

export default router