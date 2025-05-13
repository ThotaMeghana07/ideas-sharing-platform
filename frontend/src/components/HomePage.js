import React from 'react';
import Services from './Services';
  // Your existing home page styles
const HomePage = () => {
    const handleProfile = () => {
 console.log("its working");
      
      };
  return (
    <div>
      {/* Paste your entire homepage HTML here */}
      <section id="home" className="welcome">
        <h1>Welcome to Student Spark</h1>
        <p>Time to shine on different ideas...</p>
      </section>
 {/* Services Section */}
      <Services />
      <section id="services" className="services">
        {/* Your service cards */}
      </section>
      <button 
      onClick={ handleProfile}
      >post your Ideas</button>
    </div>
  );
};

export default HomePage;