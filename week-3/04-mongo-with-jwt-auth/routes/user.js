const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const jwt = require('jsonwebtoken');
const { User, Course} = require('../db/index');
const jwtPassword = process.env.jwtPassword;
const crypto = require('crypto');

// User Routes
router.post('/signup', async (req, res) => {
    // Implement user signup logic
    const username = req.body['username'];
    const password = req.body['password'];
    const oldUser = await User.find({ username: username });
    console.log(oldUser);
    if (oldUser.length !== 0) {
        return res.status(400).json({
            message: 'The username is already in use'
        })
    }
    else {
        try {
            const hashPassword = crypto.createHash('sha1').
                update(password).digest('hex');
            let newUser = new User({
                username: username,
                hashPassword: hashPassword
            });
            newUser = await newUser.save();
            res.status(200).json({
                message: 'User created successfully'
            });
        }
        catch (error) {
            return res.status(500).json({
                message: 'Internal error',
                error: error.message
            });
        }
    }
});

router.post('/signin', async (req, res) => {
    // Implement admin signup logic
    const username = req.body['username'];
    const password = req.body['password'];
    const hashPassword = crypto.createHash('sha1').
        update(password).digest('hex');
    try {
        console.log(username, hashPassword);
        const admin = await User.findOne({
            username: username,
            hashPassword: hashPassword
        });
        console.log(admin);
        if (!admin) {
            return res.status(400).json({
                message: 'Unauthorized'
            });
        }
        const jwtToken = jwt.sign({ username: username, id: admin.id }, jwtPassword);
        return res.status(200).json({
            token: jwtToken
        });
    }
    catch (error) {
        return res.status(400).json({
            message: 'Internal server error'
        });
    }
});

router.get('/courses', async (req, res) => {
    // Implement listing all courses logic
    try {
        const admin = await User.findOne({ username: username, _id: id });
        console.log(admin);
        return res.status(200).json({
            courses: admin.courses
        });
    }
    catch (error) {
        return res.status(400).json({
            message: 'Bad request',
            error: error.message
        })
    }
});

// - POST /users/courses/:courseId
//   Description: Purchases a course. courseId in the URL path should be replaced with the ID of the course to be purchased.
//   Input: Headers: { 'Authorization': 'Bearer <your-token>' }
//   Output: { message: 'Course purchased successfully' }
router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    // Implement course purchase logic
    //get course with courseId
    const courseId = req.params['courseId'];
    const decodedToken = req.decodedToken;
    const username = decodedToken['username'];
    const id = decodedToken['id'];
    try{
        const purchasingCourse = await Course.findById(courseId);
        const purchasedCourse = User.updateOne(
            {_id: id},
            {$push: {courses: purchasingCourse}}
        );
        purchasedCourse.then(()=>{
            res.status(200).json({
                message: 'Course purchased successfully'
            });
        });
    }
    catch(error){
        res.status(500).json({
            message: 'internal server error'
        });
    }
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic
    const decodedToken = req.decodedToken;
    const id = decodedToken['id'];
    try{
        const user = await User.findOne(
            {_id: id}
        );
        console.log(user);
        return res.status(200).json({
            purchasedCourses: user.courses
        });
    }
    catch(error){
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        })
    }
});

module.exports = router
