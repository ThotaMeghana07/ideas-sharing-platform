 // backend/models/Idea.js
const mongoose = require('mongoose'); // <--- ADD THIS LINE OR ENSURE IT'S THERE

// Then the rest of your IdeaSchema definition...
const IdeaSchema = new mongoose.Schema( // Now mongoose.Schema will work
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        title: {
            type: String,
            required: [true, 'Please add a title'],
            trim: true,
            maxlength: [100, 'Title cannot be more than 100 characters'],
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
            trim: true,
        },
        tags: {
            type: [String],
            default: [],
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

IdeaSchema.virtual('likeCount').get(function() {
    return this.likes.length;
});

const Idea = mongoose.model('Idea', IdeaSchema); // This line should now work

module.exports = Idea;