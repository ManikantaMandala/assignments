const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const {User, Course} = require('../db/index');

// - POST /users/signup
//   Description: Creates a new user account.
//   Input: { username: 'user', password: 'pass' }
//   Output: { message: 'User created successfully' }
router.post('/signup',async (req, res) => {
    //Implement user signup
    const username = req.body['username'];
    const password = req.body['password'];
    //find any one is there with same username
    const oldUser = await User.find(
        {username: username, password:password}
    );
    //if they are return responses
    if(oldUser.length !== 0){
        return res.status(400).json({
            message: 'the username is already in use'
        });
    }
    else{
        //else create a new user
        try{
            let newUser = new User({
                username: username,
                password: password
            });
            newUser = await newUser.save();
            return res.status(200).json({
                message: 'User created successfully'
            });
        }
        catch(error){
            return res.status(500).json({
                message: 'Internal error'
            });
        }
    }
});

// - GET /users/courses
//   Description: Lists all the courses.
//   Input: Headers: { 'username': 'username', 'password': 'password' }
//   Output: { courses: [ { id: 1, title: 'course title', description: 'course description', price: 100, imageLink: 'https://linktoimage.com', published: true }, ... ] }
router.get('/courses', async (req, res) => {
    // Implement listing all courses logic
    try{
        const courses = await Course.find({published:true});
        return res.status(200).json({courses: courses});
    }
    catch(error){
        return res.status(500).json({
            message: 'unauthorized'
        })
    }
});

// - POST /users/courses/:courseId
//   Description: Purchases a course. courseId in the URL path should be replaced with the ID of the course to be purchased.
//   Input: Headers: { 'username': 'username', 'password': 'password' }
//   Output: { message: 'Course purchased successfully' }
router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    // Implement course purchase logic
    const username = req.headers['username'];
    const password = req.headers['password'];
    const courseId = req.params['courseId'];
    try{
        const purchasingCourse = await Course.findById(courseId);
        //add to user courses array
        const purchasedCourse = User.updateOne(
            {username: username, password: password},
            {$push: {courses: purchasingCourse }}
        );
        purchasedCourse.then(()=>{
            return res.status(200).json(
                {message: 'Course purchased successfully' }
            )
        })
    }
    catch(error){
        return res.status(500).json({
            message: 'Error purchasing course',
            error: error.message
        });
    }
});

// - GET /users/purchasedCourses
//   Description: Lists all the courses purchased by the user.
//   Input: Headers: { 'username': 'username', 'password': 'password' }
//   Output: { purchasedCourses: [ { id: 1, title: 'course title', description: 'course description', price: 100, imageLink: 'https://linktoimage.com', published: true }, ... ] }
router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic
    const username = req.headers['username'];
    const password = req.headers['password'];
    try{
        const user = await User.findOne(
            {username: username, password: password}
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
