const express = require('express');
const mongoose = require('mongoose');
const app = express();

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },   
    price: { type: Number, required: true },
    type:{ type: String, enum: ['veg', 'non-veg'], required: true },
    is_drink: { type: Boolean, default: false },
    ingredients: { type: [String], required: [] },
    num_sales: { type: Number, default: 0 },
});
const Menu = mongoose.model('Menu', menuSchema);
module.exports = Menu;

