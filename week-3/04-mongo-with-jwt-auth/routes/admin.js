const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const {Admin, Course} = require('../db/index');
require('dotenv').config();
const router = Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const jwtPassword = process.env.jwtPassword;

//Admin routes
// - POST /admin/signup
//   Description: Creates a new admin account.
//   Input Body: { username: 'admin', password: 'pass' }
//   Output: { message: 'Admin created successfully' }
router.post('/signup', async (req, res) => {
    // Implement admin signup logic
    const username = req.body['username'];
    const password = req.body['password'];
    const oldAdmin = await Admin.find({username: username});
    console.log(oldAdmin);
    if(oldAdmin.length !== 0){
        return res.status(400).json({
            message: 'The username is already in use'
        })
    }
    else{
        try{
            const hashPassword = crypto.createHash('sha1').
                update(password).digest('hex');
            let newAdmin = new Admin({
                username: username,
                hashPassword: hashPassword
            });
            newAdmin = await newAdmin.save();
            res.status(200).json({
                message: 'Admin created successfully'
            });
        }
        catch(error){
            return res.status(500).json({
                message: 'Internal error'
            });
        }
    }
});

// - POST /admin/signin
//   Description: Logs in an admin account.
//   Input Body: { username: 'admin', password: 'pass' }
//   Output: { token: 'your-token' }
router.post('/signin', async (req, res) => {
    // Implement admin signup logic
    const username = req.body['username'];
    const password = req.body['password'];
    const hashPassword = crypto.createHash('sha1').
        update(password).digest('hex')
    try{
        console.log(username, hashPassword)
        const admin = await Admin.findOne({
            username: username,
            hashPassword: hashPassword
        });
        console.log(admin);
        if(!admin){
            return res.status(400).json({
                message: 'Unauthorized'
            });
        }
        const jwtToken = jwt.sign({username:username, id:admin.id}, jwtPassword);
        return res.status(200).json({
            token: jwtToken
        });
    }
    catch(error){
        return res.status(400).json({
            message: 'Internal server error'
        })
    }
});

// - POST /admin/courses
//   Description: Creates a new course.
//   Input: Headers: { 'Authorization': 'Bearer <your-token>' }, Body: { title: 'course title', description: 'course description', price: 100, imageLink: 'https://linktoimage.com' }
//   Output: { message: 'Course created successfully', courseId: "new course id" }
router.post('/courses', adminMiddleware, async (req, res) => {
    // Implement course creation logic
    const decodedToken = req.decodedToken;
    const username = decodedToken['username'];
    const id = decodedToken['id'];
    console.log(username, id);

    const title = req.body['title'];
    const description = req.body['description'];
    const price = req.body['price'];
    const imageLink = req.body['imageLink'];

    let newCourse = new Course({
        title: title,
        description: description,
        price: price,
        imageLink: imageLink,
        published: true
    });
    try{
        newCourse = await newCourse.save();
        const updateAdmin = Admin.updateOne(
            {username: username, _id: id},
            {$push: {courses: newCourse}}
        )
        updateAdmin.then(()=>{
            return res.status(200).json({
                message: 'added new course',
                courseId: newCourse._id
            })
        });
    }
    catch(error){
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
});

router.get('/courses', adminMiddleware, async (req, res) => {
    // Implement fetching all courses logic
    try{
        const decodedToken = req.decodedToken;
        const username = decodedToken['username'];
        const id = decodedToken['id'];
        const admin = await Admin.findOne({username: username, _id: id});
        console.log(admin);
        return res.status(200).json({
            courses: admin.courses
        });
    }
    catch(error){
        return res.status(400).json({
            message: 'Bad request',
            error: error.message
        })
    }
});

module.exports = router;
