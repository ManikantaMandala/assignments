// Middleware for handling auth
require('dotenv').config();
const jwtPassword = process.env.jwtPassword;
const jwt = require('jsonwebtoken');
const {Admin} = require('../db/index');

function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    const authToken = req.headers['authorization'];
    const jwtToken = authToken.split(" ");
    //verify
    jwt.verify(jwtToken[1], jwtPassword, (err, decoded)=>{
        if(err){
            return res.status(402).json({
                message: 'unauthorized'
            });
        }
        const id = decoded.id;
        const admin = Admin.findById(id)
        if(!admin){
            return res.status(401).json({
                message: "unauthorized1"
            });
        }
        req.decodedToken = decoded;
        next();
    });
}

module.exports = adminMiddleware;
