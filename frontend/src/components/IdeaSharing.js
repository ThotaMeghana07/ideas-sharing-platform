 import { useState } from 'react';
 import './IdeaSharing.css';
import { FiUpload, FiImage, FiVideo, FiHeart, FiMessageSquare } from 'react-icons/fi';

const IdeaSharing = () => {
  const [idea, setIdea] = useState('');
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  const handlePostIdea = () => {
    if (!idea.trim()) return;

    const newIdea = {
      id: Date.now(),
      text: idea,
      media: {
        image: image ? URL.createObjectURL(image) : null,
        video: video ? URL.createObjectURL(video) : null
      },
      comments: [],
      likes: 0,
      createdAt: new Date(),
      user: {
        name: 'You',
        avatar: 'https://i.pravatar.cc/150?img=3'
      }
    };

    setIdeas([newIdea, ...ideas]);
    setIdea('');
    setImage(null);
    setVideo(null);
  };

  const handleLike = (id) => {
    setIdeas(ideas.map(item => 
      item.id === id ? {...item, likes: item.likes + 1} : item
    ));
  };

  return (
    <div className="idea-sharing-app">
      {/* Header */}
      <header className="app-header">
        <div className="brand">
          <img src="" alt="Logo" className="logo" />
          <h1>Student Spark</h1>
        </div>
        
      </header>

      {/* Main Content */}
      <main className="app-container">
        {/* Idea Creation Box */}
        <div className="idea-creator">
          <div className="creator-header">
            <img src="https://i.pravatar.cc/150?img=3" alt="User" className="user-avatar" />
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Share your innovative idea..."
              rows="3"
            />
          </div>
          
          <div className="media-preview">
            {image && (
              <div className="preview-item">
                <img src={URL.createObjectURL(image)} alt="Preview" />
                <button onClick={() => setImage(null)}>×</button>
              </div>
            )}
            {video && (
              <div className="preview-item">
                <video src={URL.createObjectURL(video)} controls />
                <button onClick={() => setVideo(null)}>×</button>
              </div>
            )}
          </div>

          <div className="creator-footer">
            <div className="media-options">
              <label htmlFor="imageInput" className="media-btn">
                <FiImage /> Photo
                <input
                  id="imageInput"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  hidden
                />
              </label>
              <label htmlFor="videoInput" className="media-btn">
                <FiVideo /> Video
                <input
                  id="videoInput"
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideo(e.target.files[0])}
                  hidden
                />
              </label>
            </div>
            <button 
              onClick={handlePostIdea} 
              className="post-btn"
              disabled={!idea.trim() && !image && !video}
            >
              <FiUpload /> Post Idea
            </button>
          </div>
        </div>

        {/* Ideas Feed */}
        <div className="ideas-feed">
          <div className="feed-header">
            <h2>Community Ideas</h2>
            <div className="feed-tabs">
              <button 
                className={activeTab === 'all' ? 'active' : ''}
                onClick={() => setActiveTab('all')}
              >
                All Ideas
              </button>
              <button 
                className={activeTab === 'media' ? 'active' : ''}
                onClick={() => setActiveTab('media')}
              >
                With Media
              </button>
            </div>
          </div>

          {ideas.length === 0 ? (
            <div className="empty-state">
              <p>No ideas shared yet. Be the first to post!</p>
            </div>
          ) : (
            <div className="ideas-grid">
              {ideas.map((item) => (
                <div key={item.id} className="idea-card">
                  <div className="card-header">
                    <img src={item.user.avatar} alt={item.user.name} className="user-avatar" />
                    <div className="user-info">
                      <h4>{item.user.name}</h4>
                      <small>{new Date(item.createdAt).toLocaleString()}</small>
                    </div>
                  </div>
                  
                  <div className="card-content">
                    <p>{item.text}</p>
                    {item.media.image && (
                      <div className="media-container">
                        <img src={item.media.image} alt="Idea visual" />
                      </div>
                    )}
                    {item.media.video && (
                      <div className="media-container">
                        <video controls src={item.media.video} />
                      </div>
                    )}
                  </div>
                  
                  <div className="card-footer">
                    <button onClick={() => handleLike(item.id)}>
                      <FiHeart /> {item.likes}
                    </button>
                    <button>
                      <FiMessageSquare /> Comment
                    </button>
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