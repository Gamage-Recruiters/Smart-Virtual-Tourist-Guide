import React from "react";
import Logo from '../assets/Logo.png';
import Lotus from '../assets/Lotus.png';
import bottomLogo from '../assets/bottomLogo.png';
import sriflag from '../assets/sriflag.jpg';

/** Inline SVG social icons (lucide-react doesn't include brand icons) */
const FacebookIcon = ({ size = 30, color = "#1877F2" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
  </svg>
);

const InstagramIcon = ({ size = 30, color = "#E4405F" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);
const Footer = () => {
  return (
    <footer
      style={{
        width: "100%",
        height: "591.000732421875px",
        position: "relative",
        opacity: 1,
        background: "linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(160, 219, 255, 1) 100%)",
        color: "#22223b",
        display: "flex",
        backdropFilter: "blur(39.099998474121094px)",
        boxShadow: "0px 27px 67.1px -24px #00000040",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.2rem",
        overflow: "hidden",
      }}
    >
      <img
        src={Lotus}
        alt="Lotus"
        style={{
          position: "absolute",
          left: "-58px",
          width: "250.89px",
          height: "500.98px",
          objectFit: "cover",
          opacity: 0.40,    
          top:"80px"
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "504px",
          width: "350px",
          height: "208.53px",
          opacity: 1,
          zIndex: 10,
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              fontStyle: "bold",
              fontSize: "15px",
              lineHeight: "153%",
              letterSpacing: "0",
              color: "#122E63",
              display: "inline-block",
              verticalAlign: "middle",
              userSelect: "none",
            }}
          >
            Quick Links
          </span>
          <ul
            style={{
              margin: "12px 0 0 -2px",
              padding: 0,
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "17px",
              lineHeight: "153%",
              letterSpacing: "0",
              color: "#22223b",
              listStyle: "none",
            }}
          >
            <li style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ color: "#122E63", fontSize: "1em", marginRight: "10px" }}>&#9679;</span>
              <a href="#" style={{ color: "#22223b", textDecoration: "none" }}>Home</a>
            </li>
            <li style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ color: "#122E63", fontSize: "1em", marginRight: "10px" }}>&#9679;</span>
              <a href="#" style={{ color: "#22223b", textDecoration: "none" }}>Features</a>
            </li>
            <li style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ color: "#122E63", fontSize: "1em", marginRight: "10px" }}>&#9679;</span>
              <a href="#" style={{ color: "#22223b", textDecoration: "none" }}>Destinations</a>
            </li>
            <li style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ color: "#122E63", fontSize: "1em", marginRight: "10px" }}>&#9679;</span>
              <a href="#" style={{ color: "#22223b", textDecoration: "none", whiteSpace: "nowrap" }}>How it Works</a>
            </li>
            <li style={{ display: "flex", alignItems: "center" }}>
              <span style={{ color: "#122E63", fontSize: "1em", marginRight: "10px" }}>&#9679;</span>
              <a href="#" style={{ color: "#22223b", textDecoration: "none" }}>Safety</a>
            </li>
          </ul>
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginLeft: "102px" }}>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              fontStyle: "bold",
              fontSize: "15px",
              lineHeight: "153%",
              letterSpacing: "0",
              color: "#122E63",
              display: "inline-block",
              verticalAlign: "middle",
              userSelect: "none",
            }}
          >
            Destinations
          </span>
          <ul
            style={{
              margin: "12px 0 0 -2px",
              padding: 0,
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "17px",
              lineHeight: "153%",
              letterSpacing: "0",
              color: "#22223b",
              listStyle: "none",
            }}
          >
            <li style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ color: "#122E63", fontSize: "1em", marginRight: "10px" }}>&#9679;</span>
              <a href="#" style={{ color: "#22223b", textDecoration: "none" }}>Sigiriya</a>
            </li>
            <li style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ color: "#122E63", fontSize: "1em", marginRight: "10px" }}>&#9679;</span>
              <a href="#" style={{ color: "#22223b", textDecoration: "none" }}>Ella</a>
            </li>
            <li style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ color: "#122E63", fontSize: "1em", marginRight: "10px" }}>&#9679;</span>
              <a href="#" style={{ color: "#22223b", textDecoration: "none" }}>Galle</a>
            </li>
            <li style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ color: "#122E63", fontSize: "1em", marginRight: "10px" }}>&#9679;</span>
              <a href="#" style={{ color: "#22223b", textDecoration: "none", whiteSpace: "nowrap" }}>Yala National Park</a>
            </li>
            <li style={{ display: "flex", alignItems: "center" }}>
              <span style={{ color: "#122E63", fontSize: "1em", marginRight: "10px" }}>&#9679;</span>
              <a href="#" style={{ color: "#22223b", textDecoration: "none" }}>Colombo</a>
            </li>
          </ul>
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginLeft: "102px" }}>
          <span
            style={{
              width: 80,
              height: 23.3958683013916,
              position: "relative",
              left: 0,
              transform: "rotate(0deg)",
              opacity: 1,
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              fontStyle: "bold",
              fontSize: "15px",
              lineHeight: "153%",
              letterSpacing: "0",
              color: "#122E63",
              display: "inline-block",
              verticalAlign: "middle",
              userSelect: "none",
            }}
          >
            Support
          </span>
          <ul
            style={{
              margin: "12px 0 0 -2px",
              padding: 0,
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "17px",
              lineHeight: "153%",
              letterSpacing: "0",
              color: "#22223b",
              listStyle: "none",
            }}
          >
            <li style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ color: "#122E63", fontSize: "1em", marginRight: "10px" }}>&#9679;</span>
              <a href="#" style={{ color: "#22223b", textDecoration: "none", whiteSpace: "nowrap" }}>Help Center</a>
            </li>
            <li style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ color: "#122E63", fontSize: "1em", marginRight: "10px" }}>&#9679;</span>
              <a href="#" style={{ color: "#22223b", textDecoration: "none", whiteSpace: "nowrap" }}>Privacy Policy</a>
            </li>
            <li style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ color: "#122E63", fontSize: "1em", marginRight: "10px" }}>&#9679;</span>
              <a href="#" style={{ color: "#22223b", textDecoration: "none", whiteSpace: "nowrap" }}>Terms & Condition</a>
            </li>
            <li style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ color: "#122E63", fontSize: "1em", marginRight: "10px" }}>&#9679;</span>
              <a href="#" style={{ color: "#22223b", textDecoration: "none", whiteSpace: "nowrap" }}>FAQ</a>
            </li>
            <li style={{ display: "flex", alignItems: "center" }}>
              <span style={{ color: "#122E63", fontSize: "1em", marginRight: "10px" }}>&#9679;</span>
              <a href="#" style={{ color: "#22223b", textDecoration: "none", whiteSpace: "nowrap" }}>Travel Safety Guidelines</a>
            </li>
          </ul>
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginLeft: "102px" }}>
          <span
            style={{
              width: 100,
              height: 23.4,
              position: "relative",
              left: 0,
              transform: "rotate(0deg)",
              opacity: 1,
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              fontStyle: "bold",
              fontSize: "15px",
              lineHeight: "153%",
              letterSpacing: "0",
              color: "#122E63",
              display: "inline-block",
              verticalAlign: "middle",
              userSelect: "none",
            }}
          >
            Contact Us
          </span>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginTop: "12px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              {/* Location icon SVG */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "8px" }}>
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" fill="#e53935"/>
              </svg>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", color: "#22223b", whiteSpace: "nowrap" }}>Colombo, Sri Lanka</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", marginTop: "30px" }}>
              {/* Phone icon SVG */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "8px" }}>
                <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.07 21 3 13.93 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z" fill="#e53935"/>
              </svg>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", color: "#22223b", whiteSpace: "nowrap" }}>+91 9876543210</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", marginTop: "30px" }}>
              {/* Email icon SVG */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "8px" }}>
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zm0 12H4V8.99l8 6.99 8-6.99V18z" fill="#4fc3f7"/>
              </svg>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "15px", color: "#22223b", whiteSpace: "nowrap" }}>support@svgt.lk</span>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: "26px",
          top: "220px",
          width: "453px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 4,
        }}
      >
        <img
          src={Logo}
          alt="Sri Lanka"
          style={{
            width: "165px",
            height: "205px",
            margin: 0,
            objectFit: "contain",
            transform: "rotate(0deg)",
            opacity: 1,
            marginLeft: "-50px",
          }}
        />
        <div
          style={{
            marginTop: "-100px",
            width: "453px",
            minHeight: "77px",
            color: "#22223b",
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontStyle: "normal",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            transform: "rotate(0deg)",
            opacity: 1,
          }}
        >
        <span
          style={{
            fontSize: "19px",
            lineHeight: "121%",
            letterSpacing: "0%",
            color: "#122E63",
            marginLeft: "-10px",
            marginTop: "50px",
          }}
        >
          Smart Virtual Tourism Guide
        </span>

        <div>
                      <span
                        className="font-bold leading-tight"
                        style={{
                          fontSize: '2.5rem',
                          letterSpacing: '10px',
                          fontFamily: "'Inter', sans-serif",
                          display: 'inline-block',
                          fontWeight: 700,
                          backgroundImage: `url(${sriflag})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          color: 'transparent'
                        }}
                      >
                        Sri Lanka
                      </span> 
                        
                      </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              marginTop: '10px',
              opacity: 1,
              marginLeft: '90px',
              marginRight: 'auto',
            }}
          >
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                fontStyle: 'normal',
                fontSize: '15px',
                color: '#22223b',
                display: 'block',
                textAlign: 'left',
                lineHeight: '153%',
                letterSpacing: '0',
                width: '252px',
                maxWidth: '100%',
              }}
            >
              Ai-powered travel planning
              <br />
              platform design to help you explore
              <span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontStyle: 'normal',
                  fontSize: '15px',
                  lineHeight: '153%',
                  letterSpacing: '0',
                }}
              >
                {' '}Sri Lanka{' '}
              </span>
              safety, smartly and efficiently
            </span>
            <div
              style={{
                position: 'absolute',
                right: '40px',
                bottom: '-32px',
                display: 'flex',
                gap: '10px',
                zIndex: 10,
              }}
            >
              <a href="#" aria-label="Facebook" style={{ display: 'inline-flex' }}>
                <FacebookIcon />
              </a>
              <a href="#" aria-label="Instagram" style={{ display: 'inline-flex' }}>
                <InstagramIcon />
              </a>
              <a href="#" aria-label="X" style={{ display: 'inline-flex' }}>
                <svg
                  style={{ color: '#000000' }}
                  width="30" height="30" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M18.3 3H21l-6.4 7.3L22 21h-6.2l-4.8-6.3L5.4 21H3l6.9-7.9L2 3h6.4l4.4 5.8L18.3 3zm-1.1 16h1.7L7.9 5h-1.7l10.9 14z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "8px",
          transform: "translateX(-50%)",
          width: "250px",
          height: "25.4302921295166px",
          opacity: 1,
          fontFamily: "Inter, sans-serif",
          fontWeight: 400,
          fontStyle: "normal",
          fontSize: "14px",
          lineHeight: "137%",
          letterSpacing: "0%",
          color: "#00AAFF",
          textAlign: "center",
          whiteSpace: "nowrap",
        }}
      >
        svgt©2026 all right reserve
      </div>
      <img 
          src={bottomLogo} 
          alt="" 
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: '0px',      /* adjust: vertical offset from bottom */
            right: '10px',       /* adjust: horizontal offset from right */
            width: '680px',     /* adjust: size of the image */
            height: '1300px',
            opacity: 0.45,
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 0,
          }}
        />

      {/* Footer text and links */}
    </footer>
  );
};

export default Footer;
