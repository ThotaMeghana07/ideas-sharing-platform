// src/components/AboutPageDetails.js
import React from 'react';
import './AboutPageDetails.css'; // CSS for this specific content

// Placeholder for your team image - make sure to add it to your public/images folder
const teamImageUrl = '/images/student_spark_team.jpg';

const AboutPageDetails = () => {
    return (
        // IMPORTANT: Add an id here that matches the scrollTo target in SvgParallaxScroll.js
        <div className="about-details-container" id="about-details-content">
            <section className="intro-text-detailed">
                <p>
                    Student Spark is a student-led platform that connects innovative minds with real-world problems. It provides a space for students to post and explore practical problems, build solutions as a team, and gain mentorship from NITW professors and industry experts. We believe in creating meaningful change through youth-driven ideas.
                </p>
            </section>

            <section className="vision-mission-section">
                <div className="card vision-card">
                    <h3><span role="img" aria-label="star">🌟</span> Vision</h3>
                    <p>To become India's largest student-powered innovation network, where problems are turned into purpose by young minds.</p>
                </div>
                <div className="card mission-card">
                    <h3><span role="img" aria-label="target">🎯</span> Mission</h3>
                    <ul>
                        <li>To empower students to solve real-world problems.</li>
                        <li>To create a collaborative space of creativity, technology, and mentorship.</li>
                        <li>To connect students with experts, faculty, and industry for high-impact projects.</li>
                    </ul>
                </div>
            </section>

            <section className="why-join-section">
                <h2>Why Join Student Spark?</h2>
                <div className="benefits-grid">
                    <div className="benefit-item">
                        <h4><span role="img" aria-label="people">👥</span> Team Collaboration</h4>
                        <p>Work with diverse, talented students across departments at NITW</p>
                    </div>
                    <div className="benefit-item">
                        <h4><span role="img" aria-label="mentor">👨‍🏫</span> Expert Mentorship</h4>
                        <p>Receive guidance from professors and industry professionals</p>
                    </div>
                    <div className="benefit-item">
                        <h4><span role="img" aria-label="connect">🔗</span> Real-World Impact</h4>
                        <p>Solve practical problems that make a difference</p>
                    </div>
                    <div className="benefit-item">
                        <h4><span role="img" aria-label="skills">🛠️</span> Skill Development</h4>
                        <p>Build technical and soft skills valuable for your career</p>
                    </div>
                </div>
            </section>

            <section className="our-team-section" >
                <h2>Our Team</h2>
                <p className="team-intro-para">
                    We are backed by a passionate student team from NIT Warangal, working collaboratively to drive innovation across disciplines. Our team is guided by mentorship from professors and subject experts who support us with technical knowledge, research insight, and academic depth.
                </p>
                <div className="team-highlights" >
                    <div className="highlight-item">
                        <p><span role="img" aria-label="student-hat">🎓</span> <strong>Student-Led Initiative</strong></p>
                        <p>Created by students, for students</p>
                    </div>
                    <div className="highlight-item">
                        <p><span role="img" aria-label="teacher">👨‍🏫</span> <strong>Faculty Mentorship</strong></p>
                        <p>Supported by experienced professors</p>
                    </div>
                    <div className="highlight-item">
                        <p><span role="img" aria-label="briefcase">💼</span> <strong>Industry Connections</strong></p>
                        <p>Building bridges to the professional world</p>
                    </div>
                </div>
                <div className="team-image-container">
                    <img src="" alt="Student Spark Team graduating" />
                </div>
            </section>

            <section className="connect-with-us-section">
                <h2>Connect With Us</h2>
                <div className="connect-columns">
                    <div className="get-in-touch">
                        <h3>Get In Touch</h3>
                        <p>Have questions or want to know more about Student Spark? We'd love to hear from you!</p>
                        <ul>
                            <li><span role="img" aria-label="email">📧</span> studentspark.team@gmail.com</li>
                            <li><span role="img" aria-label="linkedin">🔗</span> LinkedIn</li>
                            <li><span role="img" aria-label="whatsapp">💬</span> WhatsApp Community</li>
                        </ul>
                    </div>
                    <div className="quick-links">
                        <h3>Quick Links</h3>
                        <ul>
                            <li><span role="img" aria-label="submit">📤</span> Submit a Problem</li>
                            <li><span role="img" aria-label="info">ℹ️</span> About Us</li>
                            <li><span role="img" aria-label="founder">💡</span> Our Founder</li>
                            <li><span role="img" aria-label="team">🤝</span> Team</li>
                        </ul>
                    </div>
                </div>
            </section>

            <footer className="about-details-footer">
                <p>© {new Date().getFullYear()} Student Spark. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default AboutPageDetails;