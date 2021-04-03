// External imports
var express = require("express")
var router = express.Router()

// Internal imports


router.post("/", (req, res, next) => {
    console.log(req)
})

export default router
