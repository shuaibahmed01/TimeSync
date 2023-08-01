import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';

import tslogo from './croppedlogo.png';

const HomePage = () => {
  const navigate = useNavigate();
  const word = "Introducing";
  const [animationFinished, setAnimationFinished] = useState(false);
  

  useEffect(() => {
    const contentDelay = 1000;
    const introAnimationDuration = 2000;

    const animationTimer = setTimeout(() => {
      setAnimationFinished(true);
      setTimeout(() => {
      }, contentDelay);
    }, introAnimationDuration);

    return () => clearTimeout(animationTimer);
  }, []);


  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  }

  return (
    <div className="intro-container">
      <h1 className={`fade-in-intro ${animationFinished ? '' : 'stay-visible'}`}>{word}</h1>
      {animationFinished && (
        <div className="fade-in-contents">
          <div className="container">
          <div className='title-container'>
            <h2 className="company-name">TimeSync.</h2>
          </div>
          <h2 className='slogan'> "Paving The Way For Efficient Scheduling."</h2>
          <img src={tslogo} className="logo" alt="Company Logo" />
          <div className="buttons">
            <button onClick={handleLogin} className="button-login">
                Login
            </button>
            <button onClick={handleRegister} className="button-signup">
                Sign Up
            </button>
          </div>
          <div className="footer-section">
            <div className="footer-link">
              <a href="/PrivacyPolicy">Privacy Policy</a>
            </div>
            <div className="divider"></div>
            <div className="footer-link">
              <a href="/TOS">Terms of Use</a>
            </div>
          </div>
      </div>
        </div>
      )}
    </div>
  );
};


export default HomePage;
