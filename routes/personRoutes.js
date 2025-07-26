const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Person = require('../models/Person'); // Import the Person model 

router.post('/', async (req, res) => {
    try {
        const data = req.body;
        const newPerson = new Person(data); //
        const response = await newPerson.save(); // Save the new person to the database
        res.status(201).json(response);
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

router.get('/', async (req, res) => {
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