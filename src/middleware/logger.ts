export default (req, res, next) => {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.info("Request: ", {...req.body, time: new Date(), url: req.originalUrl, ip})
    next()
};