// External imports
var express = require("express")
const { exec } = require('child_process');

var router = express.Router()


router.post("/", (req, res, next) => {
   
    // const modifiedFiles = req.body.head_commit.modified
    exec("git reset --hard", execCallback)
    exec("git clean -df", execCallback)
    exec("git pull -f", execCallback)
    exec("yarn run start2", execCallback)
    res.status(200).send()
})

function execCallback(err, stdout, stderr) {
    if (stdout) console.log(stdout)
    if (stderr) console.error(stderr)
}
export default router
