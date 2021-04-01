export default (req, res, next) => {
    if (process.env.NODE_ENV === "development") {
        console.log("Request: ", {...req.body, time: new Date(), url: req.originalUrl})
    }
    next()
};