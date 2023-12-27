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
    if(oldUser){
        return res.status(400).json({
            message: 'the username is already in use'
        });
    }
    //else create a new user
    else{
        const newAdmin = new Admin({
            username: username,
            password: password
        });
        newAdmin = await newAdmin.save();
        newAdmin.then(()=>{
            res.status(200).json({
                message:'Admin created successfully'
            });
        });
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

    const newCourse = new Course({
        title: title,
        description: description,
        price: price,
        imageLink: imageLink,
        published: true
    });
    newCourse = await newCourse.save();
    if(!newCourse){
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
    newCourse.then((course)=>{
        return res.status(200).json({
            message: 'Course created successfully',
            CourseId: course.id
        });
    });
});

// - GET /admin/courses
//   Description: Returns all the courses.
//   Input: Headers: { 'username': 'username', 'password': 'password' }
//   Output: { courses: [ { id: 1, title: 'course title', description: 'course description', price: 100, imageLink: 'https://linktoimage.com', published: true }, ... ] }
router.get('/courses', adminMiddleware, async (req, res) => {
    // Implement fetching all courses logic
    const allCourses = await Course.find({published: true});
    allCourses.then((courses)=>{
        return res.status(200).json(courses);
    });
});

module.exports = router;
