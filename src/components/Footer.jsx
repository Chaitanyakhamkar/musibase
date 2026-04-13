import React from 'react';

const Footer = () => {
  return (
    <footer>
      <div className="container footer-content">
        <div className="footer-text">
          &copy; {new Date().getFullYear()} MusiBase. Data powered by iTunes Search API and Lyrics.ovh.
        </div>
        <div className="footer-text">
          Built by Chaitanya
        </div>
      </div>
    </footer>
  );
};

export default Footer;
