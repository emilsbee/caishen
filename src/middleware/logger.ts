
export default (req, res, next) => {
    console.log("New request!")
    next()
};