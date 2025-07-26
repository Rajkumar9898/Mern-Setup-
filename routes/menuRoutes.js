const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu'); // Import the Menu model    

router.post('/', async (req, res) => {
    try {
        const data = req.body;
        const newMenu = new Menu(data); //
        const response = await newMenu.save(); // Save the new person to the database
        res.status(201).json(response);
    } catch (error) {
        console.error('Error in POST /person:', error);
        return res.status(500).send('Internal Server Error');
    }
});

router.get('/', async (req, res) => {
    try {
        const data = await Menu.find();
        res.status(200).json(data); // Return the list of persons
    } catch (err) {
        console.error('Error in GET /person:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/:tasteType', async (req, res) => {
    try {
        const tasteType = req.params.tasteType.toLowerCase(); // convert to lowercase for safety
        if (['veg', 'non-veg'].includes(tasteType)) {
            const response = await Menu.find({ type: tasteType });
            return res.status(200).json(response);
        } else {
            return res.status(400).json({ error: 'Invalid taste type' });
        }
    } catch (error) {
        console.error('Error in GET /menu/:tasteType:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

});


module.exports = router; 