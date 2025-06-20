// backend/controllers/ideaController.js
const Idea = require('../models/Idea');
console.log('Imported Idea model:', Idea); // <--- ADD THIS LINE
const User = require('../models/User'); // Might be needed for populating user details

// @desc    Get all ideas
// @route   GET /api/ideas
// @access  Public
exports.getIdeas = async (req, res) => {
    try {
        // We can add pagination later if needed
        const ideas = await Idea.find({})
            .populate('user', 'username email') // Populate user with only username and email
            .sort({ createdAt: -1 }); // Sort by newest first
        res.json(ideas);
    } catch (error) {
        console.error('Error fetching ideas:', error);
        res.status(500).json({ message: 'Server Error fetching ideas' });
    }
};

// @desc    Get a single idea by ID
// @route   GET /api/ideas/:id
// @access  Public
exports.getIdeaById = async (req, res) => {
    try {
        const idea = await Idea.findById(req.params.id)
            .populate('user', 'username email') // Populate author details
            // .populate('comments'); // If we had a separate comment model and wanted to populate them

        if (!idea) {
            return res.status(404).json({ message: 'Idea not found' });
        }
        res.json(idea);
    } catch (error) {
        console.error('Error fetching idea by ID:', error);
        if (error.kind === 'ObjectId') { // Mongoose specific error for invalid ID format
            return res.status(404).json({ message: 'Idea not found (invalid ID format)' });
        }
        res.status(500).json({ message: 'Server Error fetching idea' });
    }
};

// @desc    Create a new idea
// @route   POST /api/ideas
// @access  Private (requires login)
exports.createIdea = async (req, res) => {
    const { title, description, tags } = req.body;

    if (!title || !description) {
        return res.status(400).json({ message: 'Title and description are required' });
    }

    try {
        const idea = new Idea({
            title,
            description,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [], // Example: handle comma-separated tags
            user: req.user.id, // req.user is set by authMiddleware
        });

        const createdIdea = await idea.save();
        // Populate user details for the response
        await createdIdea.populate('user', 'username email');

        res.status(201).json(createdIdea);
    } catch (error) {
        console.error('Error creating idea:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Server Error creating idea' });
    }
};

// @desc    Update an existing idea
// @route   PUT /api/ideas/:id
// @access  Private (only author can update)
exports.updateIdea = async (req, res) => {
    const { title, description, tags } = req.body;

    try {
        let idea = await Idea.findById(req.params.id);

        if (!idea) {
            return res.status(404).json({ message: 'Idea not found' });
        }

        // Check if the logged-in user is the author of the idea
        if (idea.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized to update this idea' });
        }

        // Update fields if they are provided in the request
        if (title) idea.title = title;
        if (description) idea.description = description;
        if (tags) idea.tags = Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim());


        const updatedIdea = await idea.save();
        // Populate user details for the response
        await updatedIdea.populate('user', 'username email');

        res.json(updatedIdea);
    } catch (error) {
        console.error('Error updating idea:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Idea not found (invalid ID format)' });
        }
        res.status(500).json({ message: 'Server Error updating idea' });
    }
};

// @desc    Delete an idea
// @route   DELETE /api/ideas/:id
// @access  Private (only author can delete)
exports.deleteIdea = async (req, res) => {
    try {
        const idea = await Idea.findById(req.params.id);

        if (!idea) {
            return res.status(404).json({ message: 'Idea not found' });
        }

        // Check if the logged-in user is the author
        if (idea.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized to delete this idea' });
        }

        await idea.deleteOne(); // Mongoose v6+
        // For older Mongoose: await idea.remove();

        res.json({ message: 'Idea removed successfully' });
    } catch (error) {
        console.error('Error deleting idea:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Idea not found (invalid ID format)' });
        }
        res.status(500).json({ message: 'Server Error deleting idea' });
    }
};


// @desc    Like/Unlike an idea
// @route   PUT /api/ideas/:id/like
// @access  Private (requires login)
exports.likeIdea = async (req, res) => {
    try {
        const idea = await Idea.findById(req.params.id);

        if (!idea) {
            return res.status(404).json({ message: 'Idea not found' });
        }

        // Check if the idea has already been liked by this user
        const alreadyLiked = idea.likes.some(like => like.toString() === req.user.id);

        if (alreadyLiked) {
            // If already liked, remove the like (unlike)
            idea.likes = idea.likes.filter(
                (like) => like.toString() !== req.user.id
            );
        } else {
            // If not liked, add the like
            idea.likes.push(req.user.id);
        }

        await idea.save();
        // Populate user details for the response, and send back the whole idea
        // so the frontend can update its like count and liked status easily
        await idea.populate('user', 'username email');

        res.json(idea); // Send back the updated idea (includes likeCount virtual)
    } catch (error) {
        console.error('Error liking/unliking idea:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Idea not found (invalid ID format)' });
        }
        res.status(500).json({ message: 'Server Error processing like' });
    }
};