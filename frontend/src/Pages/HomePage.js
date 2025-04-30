import React from "react";
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";

const LandingPage = () => {
  return (
    <div className="bg-dark text-light min-vh-100 d-flex flex-column justify-content-center">
      <motion.h1 
          className="display-4 fw-bold mb-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Welcome to Lectern
        </motion.h1>
      <p className="text-start text-center lead mb-4">
        Revolutionize your reading experience with AI-driven assistance, powerful annotation tools,
        and a focused reading mode designed to help you truly understand, not just consume.
      </p>
      <main className="container text-center py-5">
        <div className="row mt-5">
          <div className="col-md-4">
            <i className="bi bi-eye-slash display-4 mb-3 text-primary"></i>
            <h4>Focused Reading Mode</h4>
            <p>Minimize distractions and maximize comprehension with our clean, immersive interface.</p>
          </div>
          <div className="col-md-4">
            <i className="bi bi-pencil-square display-4 mb-3 text-success"></i>
            <h4>In-App Annotations</h4>
            <p>Take notes directly on your documents, highlight key ideas, and revisit insights instantly.</p>
          </div>
          <div className="col-md-4">
            <i className="bi bi-robot display-4 mb-3 text-info"></i>
            <h4>Smart AI Tutoring</h4>
            <p>Engage with an AI that teaches—not just answers—tailored to your learning needs.</p>
          </div>
        </div>
      </main>
      <Link to="/dashboard" className="btn btn-outline-light btn-lg btn-block">
        Start Reading Now
      </Link>
    </div>
  );
};

export default LandingPage;
