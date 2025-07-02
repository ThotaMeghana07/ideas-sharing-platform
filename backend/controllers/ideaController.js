// backend/controllers/ideaController.js
const Idea = require('../models/Idea');
console.log('Imported Idea model:', Idea);
const User = require('../models/User');

// @desc    Get all ideas
// @route   GET /api/ideas
// @access  Public
exports.getIdeas = async (req, res) => {
    try {
        const ideas = await Idea.find({})
            .populate('user', 'username email')
            .sort({ createdAt: -1 });
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
            .populate('user', 'username email');

        if (!idea) {
            return res.status(404).json({ message: 'Idea not found' });
        }
        res.json(idea);
    } catch (error) {
        console.error('Error fetching idea by ID:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Idea not found (invalid ID format)' });
        }
        res.status(500).json({ message: 'Server Error fetching idea' });
    }
};


// -------------------- MODIFIED SECTION START --------------------
// @desc    Create a new idea
// @route   POST /api/ideas
// @access  Private (requires login)
exports.createIdea = async (req, res) => {
    // Your frontend sends a single 'text' field. We will use that.
    const { text } = req.body;

    // Validate the incoming 'text' field.
    if (!text || text.trim() === '') {
        return res.status(400).json({ message: 'Idea text is required' });
    }

    try {
        const idea = new Idea({
            // We map the frontend 'text' to the 'description' field in our database.
            description: text,
            // We can auto-generate a title or leave it blank if the model allows.
            // For now, let's keep the model structured. A title can be added later from the frontend.
            // You might need to make 'title' optional in your Idea.js model for this to work.
            // For example, remove `required: true` from the title field in `models/Idea.js`.
            user: req.user.id, // req.user is set by authMiddleware
        });

        const createdIdea = await idea.save();
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
// -------------------- MODIFIED SECTION END --------------------


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

        if (idea.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized to update this idea' });
        }

        if (title) idea.title = title;
        if (description) idea.description = description;
        if (tags) idea.tags = Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim());

        const updatedIdea = await idea.save();
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

        if (idea.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized to delete this idea' });
        }

        await idea.deleteOne();

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

        const alreadyLiked = idea.likes.some(like => like.toString() === req.user.id);

        if (alreadyLiked) {
            idea.likes = idea.likes.filter(
                (like) => like.toString() !== req.user.id
            );
        } else {
            idea.likes.push(req.user.id);
        }

        await idea.save();
        await idea.populate('user', 'username email');

        res.json(idea);
    } catch (error) {
        console.error('Error liking/unliking idea:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Idea not found (invalid ID format)' });
        }
        res.status(500).json({ message: 'Server Error processing like' });
    }
};