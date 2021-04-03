// External imports
var express = require("express")
const { exec } = require('child_process');

var router = express.Router()



router.post("/", (req, res, next) => {
   
    // const modifiedFiles = req.body.head_commit.modified
    exec("git reset --hard")
    exec("git clean -df")
    exec("git pull -f")
    exec("yarn run start")
    res.status(200).send()
})

export default router
