// External imports
var express = require("express")
var router = express.Router()


router.post("/", (req, res, next) => {
    const modifiedFiles = req.body.head_commit.modified
    const headers = req.headers
    console.log("Modified files: ", modifiedFiles)
    console.log("Headers: ", headers)
    res.status(200).send()
})

export default router
