import React from "react";
import facebookIcon from "../assets/facebook-svgrepo-com.svg";
import instagramIcon from "../assets/instagram-1-svgrepo-com.svg";
import Logo from '../assets/Logo.png';
import Lotus from '../assets/Lotus.png';
import bottomLogo from '../assets/bottomLogo.png';
import sriflag from '../assets/sriflag.jpg';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <img src={Lotus} alt="Lotus" className={styles.lotusImage} />

      <div className={styles.columnsContainer}>
        {/* Quick Links Column */}
        <div className={styles.column}>
          <span className={styles.columnTitle}>Quick Links</span>
          <ul className={styles.linkList}>
            <li className={styles.linkItem}>
              <span className={styles.bullet}>&#9679;</span>
              <a href="#" className={styles.link}>Home</a>
            </li>
            <li className={styles.linkItem}>
              <span className={styles.bullet}>&#9679;</span>
              <a href="#" className={styles.link}>Features</a>
            </li>
            <li className={styles.linkItem}>
              <span className={styles.bullet}>&#9679;</span>
              <a href="#" className={styles.link}>Destinations</a>
            </li>
            <li className={styles.linkItem}>
              <span className={styles.bullet}>&#9679;</span>
              <a href="#" className={styles.linkNoWrap}>How it Works</a>
            </li>
            <li className={styles.linkItemLast}>
              <span className={styles.bullet}>&#9679;</span>
              <a href="#" className={styles.link}>Safety</a>
            </li>
          </ul>
        </div>

        {/* Destinations Column */}
        <div className={styles.columnWithMargin}>
          <span className={styles.columnTitle}>Destinations</span>
          <ul className={styles.linkList}>
            <li className={styles.linkItem}>
              <span className={styles.bullet}>&#9679;</span>
              <a href="#" className={styles.link}>Sigiriya</a>
            </li>
            <li className={styles.linkItem}>
              <span className={styles.bullet}>&#9679;</span>
              <a href="#" className={styles.link}>Ella</a>
            </li>
            <li className={styles.linkItem}>
              <span className={styles.bullet}>&#9679;</span>
              <a href="#" className={styles.link}>Galle</a>
            </li>
            <li className={styles.linkItem}>
              <span className={styles.bullet}>&#9679;</span>
              <a href="#" className={styles.linkNoWrap}>Yala National Park</a>
            </li>
            <li className={styles.linkItemLast}>
              <span className={styles.bullet}>&#9679;</span>
              <a href="#" className={styles.link}>Colombo</a>
            </li>
          </ul>
        </div>

        {/* Support Column */}
        <div className={styles.columnWithMargin}>
          <span className={styles.columnTitle}>Support</span>
          <ul className={styles.linkList}>
            <li className={styles.linkItem}>
              <span className={styles.bullet}>&#9679;</span>
              <a href="#" className={styles.linkNoWrap}>Help Center</a>
            </li>
            <li className={styles.linkItem}>
              <span className={styles.bullet}>&#9679;</span>
              <a href="#" className={styles.linkNoWrap}>Privacy Policy</a>
            </li>
            <li className={styles.linkItem}>
              <span className={styles.bullet}>&#9679;</span>
              <a href="#" className={styles.linkNoWrap}>Terms & Condition</a>
            </li>
            <li className={styles.linkItem}>
              <span className={styles.bullet}>&#9679;</span>
              <a href="#" className={styles.linkNoWrap}>FAQ</a>
            </li>
            <li className={styles.linkItemLast}>
              <span className={styles.bullet}>&#9679;</span>
              <a href="#" className={styles.linkNoWrap}>Travel Safety Guidelines</a>
            </li>
          </ul>
        </div>

        {/* Contact Us Column */}
        <div className={styles.columnWithMargin}>
          <span className={styles.columnTitle}>Contact Us</span>
          <div className={styles.contactList}>
            <div className={styles.contactItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.contactIcon}>
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" fill="#e53935"/>
              </svg>
              <span className={styles.contactText}>Colombo, Sri Lanka</span>
            </div>
            <div className={styles.contactItemSpaced}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.contactIcon}>
                <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.07 21 3 13.93 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z" fill="#e53935"/>
              </svg>
              <span className={styles.contactText}>+91 9876543210</span>
            </div>
            <div className={styles.contactItemSpaced}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.contactIcon}>
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zm0 12H4V8.99l8 6.99 8-6.99V18z" fill="#4fc3f7"/>
              </svg>
              <span className={styles.contactText}>support@svgt.lk</span>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Section */}
      <div className={styles.brandSection}>
        <img src={Logo} alt="Sri Lanka" className={styles.logo} />
        <div className={styles.brandInfo}>
          <span className={styles.brandTitle}>
            Smart Virtual Tourism Guide
          </span>

          <div>
            <span
              className={styles.flagText}
              style={{ backgroundImage: `url(${sriflag})` }}
            >
              Sri Lanka
            </span>
          </div>

          <div className={styles.descriptionBox}>
            <span className={styles.description}>
              Ai-powered travel planning
              <br />
              platform design to help you explore
              <span className={styles.descriptionHighlight}>
                {' '}Sri Lanka{' '}
              </span>
              safety, smartly and efficiently
            </span>

            <div className={styles.socialsList}>
              <a href="#" aria-label="Facebook" className={styles.socialLink}>
                <img src={facebookIcon} alt="Facebook" className={styles.socialIcon} />
              </a>
              <a href="#" aria-label="Instagram" className={styles.socialLink}>
                <img src={instagramIcon} alt="Instagram" className={styles.socialIcon} />
              </a>
              <a href="#" aria-label="X" className={styles.socialLink}>
                <svg
                  className="text-black"
                  width="30" height="30" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M18.3 3H21l-6.4 7.3L22 21h-6.2l-4.8-6.3L5.4 21H3l6.9-7.9L2 3h6.4l4.4 5.8L18.3 3zm-1.1 16h1.7L7.9 5h-1.7l10.9 14z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className={styles.copyright}>
        svgt©2026 all right reserve
      </div>

      <img 
        src={bottomLogo} 
        alt="" 
        aria-hidden="true"
        className={styles.bottomLogoImage}
      />
    </footer>
  );
};

export default Footer;
