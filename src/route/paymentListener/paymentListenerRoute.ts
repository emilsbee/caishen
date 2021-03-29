import { NextFunction, Response } from "express";

const fs = require('fs');

var express = require("express")
var router = express.Router()

router.post("/", (req, res:Response, next:NextFunction) => {
    
    const payment = req.body.NotificationUrl.object.Payment
    
    const amount = payment.amount.value
    const currency = payment.amount.currency
    const payeeName = payment.counterparty_alias.display_name
    
})

export default router