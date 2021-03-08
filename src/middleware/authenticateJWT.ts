// External imports
var jwt = require("jsonwebtoken")

/**
 * Middleware for authenticating JWT session tokens.
 * @param req The request object.
 * @param res The response object.
 * @param next Method to move on to next route, handler or error handler.
 */
export const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
        
        const token = authHeader.split(' ')[1];
        
        jwt.verify(token, process.env.DEV_JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            
            next();
        });
    } else {
        res.sendStatus(401);
    }
};