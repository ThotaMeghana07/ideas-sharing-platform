 
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../auth/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);

  return (
    <nav className="Navbar">
      <div className="logo">
        <Link to="/">Student Spark</Link>
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/ideas">Share Ideas</Link>
      </div>
      {currentUser ? (
        <div className="user-section" >
          <img 
  src={`https://ui-avatars.com/api/?name=${currentUser.username}&background=6c5ce7&color=fff`}
  alt="User avatar"
  className="user-avatar"
/>
          <span className="username">Hi, {currentUser.username}</span>
          <button className="logout-btn" onClick={logout}>
            
            Logout
          </button>
          
 
        </div>
      ) : (
        <Link to="/login" className="login-btn">
          Login
        </Link>
      )}
    </nav>
  );
};

export default Navbar;