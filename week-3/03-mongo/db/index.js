const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('your-mongodb-url');

const CourseSchema = new mongoose.Schema({
    // Schema definition here
    title: String,
    description: String,
    price: Number,
    imageLink: String,
    published: Boolean
});
// Define schemas
const AdminSchema = new mongoose.Schema({
    // Schema definition here
    username: username,
    password: password
});

const UserSchema = new mongoose.Schema({
    // Schema definition here
    username: username,
    password: password
});

const Admin = mongoose.model('Admin', AdminSchema);
const User = mongoose.model('User', UserSchema);
const Course = mongoose.model('Course', CourseSchema);

module.exports = {
    Admin,
    User,
    Course
}
