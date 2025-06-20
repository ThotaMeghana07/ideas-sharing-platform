//Routes for ideas (CRUD, likes)
// backend/routes/ideaRoutes.js
const express = require('express');
const router = express.Router();
const {
    getIdeas,
    getIdeaById,
    createIdea,
    updateIdea,
    deleteIdea,
    likeIdea
} = require('../controllers/ideaController');
const { protect } = require('../middleware/authMiddleware'); // Our authentication middleware

// Public routes
router.get('/', getIdeas);         // GET /api/ideas - Get all ideas
router.get('/:id', getIdeaById);   // GET /api/ideas/:id - Get a single idea

// Protected routes (require authentication)
router.post('/', protect, createIdea);        // POST /api/ideas - Create a new idea
router.put('/:id', protect, updateIdea);      // PUT /api/ideas/:id - Update an idea
router.delete('/:id', protect, deleteIdea);   // DELETE /api/ideas/:id - Delete an idea
router.put('/:id/like', protect, likeIdea);   // PUT /api/ideas/:id/like - Like/unlike an idea

module.exports = router;