const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Example route to get user-specific data
router.get('/', auth, async (req, res) => {
  try {
    // Find user by ID
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Add Pokemon to user's collection
router.post('/add-pokemon', auth, async (req, res) => {
  try {
    const { pokemonName } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    // Add the Pokemon to the user's capturedPokemon map
    user.capturedPokemon.set(pokemonName, true);
    await user.save();
    res.status(200).json({ msg: 'Pokemon added successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Route to remove a captured Pokemon
router.delete('/remove-pokemon/:pokemonName', auth, async (req, res) => {
  try {
    // Get the authenticated user ID from the request object
    const userId = req.user.id;

    // Extract the Pokemon name from the request parameters
    const { pokemonName } = req.params;

    // Find the user by ID and update the capturedPokemon array to remove the specified Pokemon
    const user = await User.findByIdAndUpdate(
      userId,
      { $unset: { [`capturedPokemon.${pokemonName}`]: 1 } }, // Remove the specified Pokemon from the capturedPokemon object
      { new: true } // Return the updated user document
    );

    res.json(user);
  } catch (error) {
    console.error('Error removing Pokemon:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET endpoint to retrieve captured Pokemon for the authenticated user
router.get('/captured-pokemon', auth, async (req, res) => {
  try {
    // Find the authenticated user by their ID
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Retrieve the list of captured Pokemon for the user
    const capturedPokemon = user.capturedPokemon;

    res.json(capturedPokemon);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
module.exports = router;
