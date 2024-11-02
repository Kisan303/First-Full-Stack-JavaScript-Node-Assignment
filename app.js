const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const User = require('./models/User'); // Ensure you have the correct model path

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Set up Pug as the view engine
app.set('view engine', 'pug');
app.set('views', './views'); // Ensure this directory is correct

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
    res.render('addUser'); // Ensure addUser.pug exists in the views folder
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
        res.render('viewUser', { users }); // Ensure viewUser.pug exists
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching users');
    }
});

// Update User Form
app.get('/updateUser/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.render('updateUser', { user }); // Ensure updateUser.pug exists
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

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



// localhose server port:
// http://localhost:3000/
