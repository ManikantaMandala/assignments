const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const {Admin, Course} = require('../db/index');

const router = Router();

// Admin Routes
// - POST /admin/signup
//   Description: Creates a new admin account.
//   Input Body: { username: 'admin', password: 'pass' }
//   Output: { message: 'Admin created successfully' }
router.post('/signup', async (req, res) => {
    // Implement admin signup logic
    const username = req.body['username'];
    const password = req.body['password'];
    //find any one is there with same username
    const oldUser = await Admin.find(
        {username: username, password:password}
    );
    //if they are return responses
    if(oldUser.length !== 0){
        return res.status(400).json({
            message: 'the username is already in use'
        });
    }
    //else create a new user
    else{
        try{
            let newAdmin = new Admin({
                username: username,
                password: password
            });
            newAdmin = await newAdmin.save();
            res.status(200).json({
                message:'Admin created successfully'
            });
        }
        catch(err){
            res.status(500).json({
                message: 'Error creating admin',
                error: err.message
            });
        }
    }
});

// - POST /admin/courses
//   Description: Creates a new course.
//   Input: Headers: { 'username': 'username', 'password': 'password' }, Body: { title: 'course title', description: 'course description', price: 100, imageLink: 'https://linktoimage.com' }
//   Output: { message: 'Course created successfully', courseId: "new course id" }
router.post('/courses', adminMiddleware,async (req, res) => {
    // Implement course creation logic
    const title = req.body['title'];
    const description = req.body['description'];
    const price = req.body['price'];
    const imageLink = req.body['imageLink'];
    const username = req.headers['username'];
    const password = req.headers['password'];

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
            {username: username, password: password},
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

// - GET /admin/courses
//   Description: Returns all the courses.
//   Input: Headers: { 'username': 'username', 'password': 'password' }
//   Output: { courses: [ { id: 1, title: 'course title', description: 'course description', price: 100, imageLink: 'https://linktoimage.com', published: true }, ... ] }
router.get('/courses', adminMiddleware, async (req, res) => {
    // Implement fetching all courses logic
    try{
        const username = req.headers['username'];
        const password = req.headers['password'];
        console.log(username);
        const admin = await Admin.findOne({username: username, password: password});
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
