const mongoose = require('mongoose');
require('dotenv').config();
const mongodb_link_url = process.env.MONGODB_LINK_URL;

// Connect to MongoDB
mongoose.connect(mongodb_link_url);

// Define schemas
const CourseSchema = new mongoose.Schema({
    // Schema definition here
    title: String,
    description: String,
    price: Number,
    imageLink: String,
    published: Boolean
});

const AdminSchema = new mongoose.Schema({
    // Schema definition here
    username: String,
    hashPassword: String,
    courses: [CourseSchema]
});

const UserSchema = new mongoose.Schema({
    // Schema definition here
    username: String,
    hashPassword: String,
    courses: [CourseSchema]
});

const Admin = mongoose.model('Admin', AdminSchema);
const User = mongoose.model('User', UserSchema);
const Course = mongoose.model('Course', CourseSchema);

module.exports = {
    Admin,
    User,
    Course
}
