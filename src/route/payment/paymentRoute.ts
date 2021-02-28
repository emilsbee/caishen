var express = require("express")
var router = express.Router()

router.use((req, res, next) => {
    console.log("Time: ", Date.now())
    next()
})

router.get("/", (req, res) => {
    res.send("Returning single payment")
})

router.get("/batch", (req, res) => {
    res.send("Returning a batch of payments")
})

export default router