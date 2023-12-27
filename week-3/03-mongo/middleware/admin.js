const {Admin} = require('../db/index');
// Middleware for handling auth
async function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    const username = req.headers['username'];
    const password = req.headers['password'];
    const adminUser = await Admin.find(
        {username: username, password:password}
    );
    if(!adminUser){
        return res.status(401).json({
            message: 'incorrect username or password'
        });
    } 
    else{
        next();
    }
}

module.exports = adminMiddleware;
