const {User} = require('../db/index');
async function userMiddleware(req, res, next) {
    // Implement user auth logic
    // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
    const username = req.headers['username'];
    const password = req.headers['password'];
    const user = User.find(
        {username: username, password:password}
    );
    if(!user){
        return res.send(401).json({
            message: 'incorrect username or password'
        });
    }
    else next();
}

module.exports = userMiddleware;
