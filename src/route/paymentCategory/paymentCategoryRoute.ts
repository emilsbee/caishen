// External imports
import {getRepository} from "typeorm"
import {validate} from "class-validator"
var express = require("express")
var router = express.Router()

// Internal imports

router.get("/", async (req, res, next) => {
    res.json({message: "All good here at payment category route!"})
})


export default router
