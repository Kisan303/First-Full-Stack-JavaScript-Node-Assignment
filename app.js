//STUDENT NAME: KISAN-RAI
//STUDENT NUMBER: C0910925
//ASSIGNMENT NAME:First Full-stack JavaScript & Node Assignment 

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path'); 
const User = require('./models/User');

const app = express(); // Initialize the app object first

// Serve static files from the "style" folder
app.use('/style', express.static(path.join(__dirname, 'style')));

// Middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Set up Pug as the view engine
app.set('view engine', 'pug');
app.set('views', './views'); 

// Connect to MongoDB
mongoose.connect('mongodb+srv://root:qL1Zu8Piby76mhIb@cluster0.ocxny.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

// Home route (optional)
app.get('/', (req, res) => {
    res.send('Welcome to the User Management System!');
});

// Add User Form
app.get('/addUser', (req, res) => {
    res.render('addUser'); 
});

// Add User
app.post('/addUser', async (req, res) => {
    try {
        const newUser = new User({
            lastName: req.body.lastName,
            firstName: req.body.firstName,
            dateOfBirth: req.body.dateOfBirth,
            address1: req.body.address1,
            address2: req.body.address2,
            city: req.body.city,
            postalCode: req.body.postalCode,
            country: req.body.country,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            userNotes: req.body.userNotes,
        });
        await newUser.save();
        res.redirect('/viewUser');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding user');
    }
});

// View Users
app.get('/viewUser', async (req, res) => {
    try {
        const users = await User.find({});
        res.render('viewUser', { users });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching users');
    }
});

// Update User Form
app.get('/updateUser/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.render('updateUser', { user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching user for update');
    }
});

// Update User
app.put('/updateUser/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            lastName: req.body.lastName,
            firstName: req.body.firstName,
            dateOfBirth: req.body.dateOfBirth,
            address1: req.body.address1,
            address2: req.body.address2,
            city: req.body.city,
            postalCode: req.body.postalCode,
            country: req.body.country,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            userNotes: req.body.userNotes,
        }, { new: true });
        res.redirect('/viewUser');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating user');
    }
});

// Delete User
app.post('/deleteUser/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.redirect('/viewUser');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting user');
    }
});

// User Detail Page
app.get('/viewUser/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.render('userDetail', { user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching user details');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// URLS: http://localhost:3000/viewUser