var express = require("express")
var router = express.Router()

router.get("/", (req, res) => {
    res.send("Returning single payment")
})

router.get("/batch", (req, res) => {
    res.send("Returning a batch of payments")
})

export default router