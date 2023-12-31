//Middleware for handling auth
require('dotenv').config();
const jwtPassword = process.env.jwtPassword;
const jwt = require('jsonwebtoken');
const {User} = require('../db/index');

function userMiddleware(req, res, next) {
    // Implement user auth logic
    // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
    const authToken = req.headers['authorization'];
    const jwtToken = authToken.split(" ");
    jwt.verify(jwtToken[1], jwtPassword, (err, decoded)=>{
        if(err){
            return res.status(402).json({
                message: 'Unauthorized'
            });
        }
        const id = decoded.id;
        const user = User.findById(id)
        if(!user){
            return res.status(401).json({
                message: "unauthorized"
            });
        }
        req.decodedToken = decoded;
        next();
    })
}

module.exports = userMiddleware;
