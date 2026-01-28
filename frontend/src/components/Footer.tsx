import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer-content-wrapper">
        <div className="footer-left">
          <img
            src="/assets/rentals-logo-footer.png"
            alt="Rentals.ph logo"
            className="footer-logo"
          />
          <p className="footer-tagline">
            Unlock the door to your new beginning.
          </p>
          <div className="footer-social-icons">
            <a href="#facebook" className="footer-social-link" aria-label="Facebook">
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="30" cy="30" r="15" fill="white"/>
                <path d="M33.75 31.875H36.5625L37.5 27.1875H33.75V24.8438C33.75 23.6156 33.75 22.5 36.0938 22.5H37.5V18.6656C37.0828 18.6094 35.6859 18.4688 34.2047 18.4688C31.1109 18.4688 29.0625 20.2406 29.0625 23.8313V27.1875H25.7813V31.875H29.0625V42.6563H33.75V31.875Z" fill="#002D84"/>
              </svg>
            </a>
            <a href="#instagram" className="footer-social-link" aria-label="Instagram">
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="30" cy="30" r="15" fill="white"/>
                <path d="M30 22.5C26.55 22.5 23.75 25.3 23.75 28.75V31.25C23.75 34.7 26.55 37.5 30 37.5H32.5C35.95 37.5 38.75 34.7 38.75 31.25V28.75C38.75 25.3 35.95 22.5 32.5 22.5H30ZM30 24.375H32.5C34.95 24.375 36.875 26.3 36.875 28.75V31.25C36.875 33.7 34.95 35.625 32.5 35.625H30C27.55 35.625 25.625 33.7 25.625 31.25V28.75C25.625 26.3 27.55 24.375 30 24.375ZM34.0625 25.3125C33.5469 25.3125 33.125 25.7344 33.125 26.25C33.125 26.7656 33.5469 27.1875 34.0625 27.1875C34.5781 27.1875 35 26.7656 35 26.25C35 25.7344 34.5781 25.3125 34.0625 25.3125ZM31.25 26.875C29.1797 26.875 27.5 28.5547 27.5 30.625C27.5 32.6953 29.1797 34.375 31.25 34.375C33.3203 34.375 35 32.6953 35 30.625C35 28.5547 33.3203 26.875 31.25 26.875ZM31.25 28.75C32.3203 28.75 33.125 29.5547 33.125 30.625C33.125 31.6953 32.3203 32.5 31.25 32.5C30.1797 32.5 29.375 31.6953 29.375 30.625C29.375 29.5547 30.1797 28.75 31.25 28.75Z" fill="#002D84"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-middle">
          <h3 className="footer-section-title">LINKS</h3>
          <Link to="/" className="footer-link">Home</Link>
          <Link to="/about" className="footer-link">About</Link>
          <Link to="/blog" className="footer-link">Blog</Link>
          <Link to="/news" className="footer-link">News</Link>
          <Link to="/contact" className="footer-link">Contact</Link>
        </div>

        <div className="footer-right">
          <h3 className="footer-section-title">LEGAL</h3>
          <a href="#terms" className="footer-link">Terms of Service</a>
          <a href="#privacy" className="footer-link">Privacy Policy</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">
          © 2026 Rental.ph. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer

