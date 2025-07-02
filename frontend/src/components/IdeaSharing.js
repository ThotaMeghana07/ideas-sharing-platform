import { useState, useEffect } from 'react'; // ADDED: useEffect
import './IdeaSharing.css';
import { FiUpload, FiImage, FiVideo, FiHeart, FiMessageSquare } from 'react-icons/fi';
import { API } from '../api'; // ADDED: To make API calls
import { useAuth } from '../auth/AuthContext'; // ADDED: To get the current logged-in user

const IdeaSharing = () => {
  const [ideaText, setIdeaText] = useState(''); // RENAMED: from 'idea' to 'ideaText' for clarity
  const [image, setImage] = useState(null); // We will handle file uploads in a future step
  const [video, setVideo] = useState(null); // We will handle file uploads in a future step
  
  const [ideas, setIdeas] = useState([]); // This will now be populated from the API
  const [loading, setLoading] = useState(true); // ADDED: Loading state for better UX
  const [error, setError] = useState(null); // ADDED: Error state
  
  const [activeTab, setActiveTab] = useState('all');

  // ADDED: Get the logged-in user from our AuthContext
  const { user } = useAuth();

  // ADDED: useEffect to fetch ideas from the backend when the component loads
  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/ideas'); // API call to get all ideas
        setIdeas(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch ideas:", err);
        setError("Could not load ideas from the community.");
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
  }, []); // The empty array [] means this effect runs only once on component mount

  // CHANGED: This function now sends the new idea to the backend
  const handlePostIdea = async () => {
    if (!ideaText.trim()) return;

    try {
      // The backend expects a 'text' field, which we map from our 'ideaText' state
      const { data: newIdea } = await API.post('/ideas', { text: ideaText });

      // Add the new idea from the server to the top of our ideas list
      setIdeas([newIdea, ...ideas]);
      
      // Reset input fields
      setIdeaText('');
      setImage(null);
      setVideo(null);
    } catch (err) {
      console.error("Failed to post idea:", err);
      alert("Error: Could not post your idea. Please try again.");
    }
  };

  // CHANGED: This function now sends a 'like' request to the backend
  const handleLike = async (ideaId) => {
    try {
      // Send a request to the 'like' endpoint
      const { data: updatedIdea } = await API.put(`/ideas/${ideaId}/like`);

      // Find the idea in our local state and replace it with the updated one from the server
      setIdeas(ideas.map(i => (i._id === updatedIdea._id ? updatedIdea : i)));
    } catch (err) {
      console.error("Failed to like idea:", err);
      alert("Failed to update like. Please try again.");
    }
  };

  // Helper to check if the current user has liked a specific idea
  const isLikedByCurrentUser = (idea) => {
    // The backend `likes` field is an array of user IDs. `user._id` is from our AuthContext.
    return idea.likes.includes(user?._id);
  };

  return (
    <div className="idea-sharing-app">
      <header className="app-header">
        <div className="brand">
          <img src="" alt="Logo" className="logo" />
          <h1>Student Spark</h1>
        </div>
      </header>

      <main className="app-container">
        {/* Idea Creation Box */}
        <div className="idea-creator">
          <div className="creator-header">
            {/* ADDED: Use a placeholder if user or avatar isn't available */}
            <img src={user?.avatar || `https://i.pravatar.cc/150?u=${user?._id}`} alt="User" className="user-avatar" />
            <textarea
              value={ideaText}
              onChange={(e) => setIdeaText(e.target.value)}
              placeholder="Share your innovative idea..."
              rows="3"
            />
          </div>
          
          {/* Note: File upload display logic is fine, but the upload itself will be a future step */}
          <div className="media-preview">
            {image && <div className="preview-item"><img src={URL.createObjectURL(image)} alt="Preview" /><button onClick={() => setImage(null)}>×</button></div>}
            {video && <div className="preview-item"><video src={URL.createObjectURL(video)} controls /><button onClick={() => setVideo(null)}>×</button></div>}
          </div>

          <div className="creator-footer">
            <div className="media-options">
              {/* File input logic remains for now, we'll connect it to an upload function later */}
              <label htmlFor="imageInput" className="media-btn"><FiImage /> Photo<input id="imageInput" type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} hidden /></label>
              <label htmlFor="videoInput" className="media-btn"><FiVideo /> Video<input id="videoInput" type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} hidden /></label>
            </div>
            <button onClick={handlePostIdea} className="post-btn" disabled={!ideaText.trim() && !image && !video}>
              <FiUpload /> Post Idea
            </button>
          </div>
        </div>

        {/* Ideas Feed */}
        <div className="ideas-feed">
          <div className="feed-header">
            <h2>Community Ideas</h2>
            {/* Feed tabs logic is fine */}
            <div className="feed-tabs">
              <button className={activeTab === 'all' ? 'active' : ''} onClick={() => setActiveTab('all')}>All Ideas</button>
              <button className={activeTab === 'media' ? 'active' : ''} onClick={() => setActiveTab('media')}>With Media</button>
            </div>
          </div>

          {loading ? (
            <p>Loading ideas...</p>
          ) : error ? (
            <div className="empty-state"><p>{error}</p></div>
          ) : ideas.length === 0 ? (
            <div className="empty-state"><p>No ideas shared yet. Be the first to post!</p></div>
          ) : (
            <div className="ideas-grid">
              {/* CHANGED: Mapping over ideas from the API */}
              {ideas.map((item) => (
                // CHANGED: Use item._id from MongoDB as the key
                <div key={item._id} className="idea-card">
                  <div className="card-header">
                    {/* CHANGED: Use populated user data from the backend */}
                    <img src={item.user?.avatar || `https://i.pravatar.cc/150?u=${item.user?._id}`} alt={item.user?.username} className="user-avatar" />
                    <div className="user-info">
                      <h4>{item.user?.username || 'Anonymous'}</h4>
                      <small>{new Date(item.createdAt).toLocaleString()}</small>
                    </div>
                  </div>
                  
                  <div className="card-content">
                    {/* CHANGED: The backend model uses 'description' */}
                    <p>{item.description}</p>
                    {/* Note: The below will work once we implement file uploads and save imageUrl/videoUrl */}
                    {item.imageUrl && <div className="media-container"><img src={item.imageUrl} alt="Idea visual" /></div>}
                    {item.videoUrl && <div className="media-container"><video controls src={item.videoUrl} /></div>}
                  </div>
                  
                  <div className="card-footer">
                    {/* CHANGED: Pass item._id to handleLike and update button style if liked */}
                    <button onClick={() => handleLike(item._id)} className={isLikedByCurrentUser(item) ? 'liked' : ''}>
                      <FiHeart /> 
                      {/* CHANGED: The 'likes' field is now an array, so we display its length */}
                      {item.likes.length}
                    </button>
                    <button><FiMessageSquare /> Comment</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default IdeaSharing;