// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Route to Display Add User Form
router.get('/add', (req, res) => {
    res.render('addUser');
});

// Route to Handle Form Submission (Add User)
router.post('/add', async (req, res) => {
    const user = new User(req.body);
    await user.save();
    res.redirect('/view');
});

// Route to Display Users in a Table
router.get('/view', async (req, res) => {
    const users = await User.find();
    res.render('viewUsers', { users });
});

// Route to Display Update User Form
router.get('/update/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    res.render('updateUser', { user });
});

// Route to Handle Update User Submission
router.put('/update/:id', async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/view');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Route to Delete a User
router.post('/delete/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/view');
});

module.exports = router;
