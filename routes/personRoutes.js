const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Person = require('../models/Person'); // Import the Person model 
const { jwtMiddleware, generateToken } = require('../routes/jwt'); // Import JWT authentication middleware

// Route to create a new person
router.post('/signup', async (req, res) => {
    try {
        const data = req.body;
        const newPerson = new Person(data); //
        const response = await newPerson.save(); // Save the new person to the database

        const payload = { id: response._id }
        const token = generateToken(payload); // Generate JWT token
        res.status(200).json({  message: 'Person created successfully',response: response,token: token }); // Return the created person and token});
    } catch (error) {
        if (error.code === 11000) {
            // This is a MongoDB duplicate key error
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({ error: `${field} already exists` });
        }
        console.error('Error in POST /person:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to login a person
router.post('/login', async (req, res) => {
    try {
        const {username,password} = req.body; // Get email and password from request body
        const user = await Person.findOne({ username: username}); // Find user by email 
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid username or password' }); // If user not found or password doesn't match
        }
        const payload = { id: user._id }; // Create payload for JWT
        const token = generateToken(payload); // Generate JWT token
        res.json({token}); // Return the token 
    }
        catch (error) {
            console.error('Error in POST /person/login:', error);   
            return res.status(500).json({ error: 'Internal Server Error' });
        }
});

router.get('/profile', jwtMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from JWT payload
        const user = await Person.findById(userId); // Find user by ID
        if (!user) {        
            return res.status(404).json({ error: 'User not found' }); // If user not found
        }
        res.status(200).json(user); // Return user data
    } catch (error) {
        console.error('Error in GET /person/me:', error);
        res.status(500).json({ error: 'Internal Server Error' }); // Handle server error
    }
}); 

// Get all persons
router.get('/',jwtMiddleware, async (req, res) => {
    try {
        const data = await Person.find();
        res.status(200).json(data); // Return the list of persons
    } catch (err) {
        console.error('Error in GET /person:', err);
        res.status(500).json('Internal Server Error');
    }
});
// Get a person by ID 
router.get('/:workType', async (req, res) => {
    try {
        const workType = req.params.workType.toLowerCase(); // convert to lowercase for safety
        if (['chef', 'waiter', 'manager'].includes(workType)) {
            const response = await Person.find({ work: workType });
            return res.status(200).json(response);
        } else {
            return res.status(400).json({ error: 'Invalid work type' });
        }
    } catch (error) {
        console.error('Error in GET /person/:workType:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update a person by ID
router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        // ✅ Check if the id is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'Invalid person ID' });
        }
        const data = req.body;
        const response = await Person.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true
        });
        if (!response) {
            return res.status(404).json({ error: 'Person not found' });
        }
        res.status(200).json(response);
    } catch (error) {
        console.error('Error in PUT /person/:id:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Delete a person by ID
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id; // get the ID from the request parameters 
        // ✅ Check if the id is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'Invalid person ID' });
        }
        const response = await Person.findByIdAndDelete(id);
        if (!response) {
            return res.status(404).json({ error: 'Person not found' });
        }
        res.status(200).json({ error: "person deletde succesfully" }); // No content
    } catch (error) {
        console.error('Error in DELETE /person/:id:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;