import React from 'react'

function Footer() {
  const footerStyle = {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '2rem',
    marginTop: '3rem',
    borderRadius: '12px 12px 0 0'
  }

  const footerContentStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    marginBottom: '1.5rem'
  }

  const footerSectionStyle = {
    marginBottom: '1rem'
  }

  const footerTitleStyle = {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '0.75rem',
    color: '#e74c3c'
  }

  const footerTextStyle = {
    fontSize: '0.9rem',
    lineHeight: '1.5',
    marginBottom: '0.5rem'
  }

  const footerLinkStyle = {
    color: '#3498db',
    textDecoration: 'none',
    fontSize: '0.9rem',
    display: 'block',
    marginBottom: '0.3rem',
    transition: 'color 0.3s ease'
  }

  const footerBottomStyle = {
    borderTop: '1px solid #34495e',
    paddingTop: '1rem',
    textAlign: 'center',
    fontSize: '0.9rem',
    color: '#bdc3c7'
  }

  const socialLinksStyle = {
    display: 'flex',
    gap: '1rem',
    marginTop: '0.5rem'
  }

  const socialIconStyle = {
    fontSize: '1.5rem',
    cursor: 'pointer',
    transition: 'transform 0.3s ease'
  }

  return (
    <footer style={footerStyle}>
      <div style={footerContentStyle}>
        <div style={footerSectionStyle}>
          <h3 style={footerTitleStyle}>About Us</h3>
          <p style={footerTextStyle}>
            We are dedicated to providing the highest quality meat products. 
            Our commitment to freshness and premium quality ensures that every 
            product meets the highest standards of excellence.
          </p>
        </div>
        
        <div style={footerSectionStyle}>
          <h3 style={footerTitleStyle}>Contact</h3>
          <p style={footerTextStyle}>
            📧 Email: info@taaza.com
          </p>
          <p style={footerTextStyle}>
            📞 Phone: +91 1234567890
          </p>
          <p style={footerTextStyle}>
            📍 Address: 123 Meat Street, Food City, FC 12345
          </p>
        </div>
        
        <div style={footerSectionStyle}>
          <h3 style={footerTitleStyle}>Quick Links</h3>
          <a href="/" style={footerLinkStyle} onMouseEnter={(e) => e.target.style.color = '#2980b9'} onMouseLeave={(e) => e.target.style.color = '#3498db'}>
            🏠 Home
          </a>
          <a href="/cart" style={footerLinkStyle} onMouseEnter={(e) => e.target.style.color = '#2980b9'} onMouseLeave={(e) => e.target.style.color = '#3498db'}>
            🛒 Cart
          </a>
          <a href="/orders" style={footerLinkStyle} onMouseEnter={(e) => e.target.style.color = '#2980b9'} onMouseLeave={(e) => e.target.style.color = '#3498db'}>
            📋 Orders
          </a>
        </div>
        
        <div style={footerSectionStyle}>
          <h3 style={footerTitleStyle}>Follow Us</h3>
          <div style={socialLinksStyle}>
            <a href="#" style={footerLinkStyle} onMouseEnter={(e) => e.target.style.color = '#2980b9'} onMouseLeave={(e) => e.target.style.color = '#3498db'}>
              📘 Facebook
            </a>
            <a href="#" style={footerLinkStyle} onMouseEnter={(e) => e.target.style.color = '#2980b9'} onMouseLeave={(e) => e.target.style.color = '#3498db'}>
              🐦 Twitter
            </a>
            <a href="#" style={footerLinkStyle} onMouseEnter={(e) => e.target.style.color = '#2980b9'} onMouseLeave={(e) => e.target.style.color = '#3498db'}>
              📷 Instagram
            </a>
          </div>
        </div>
      </div>
      
      <div style={footerBottomStyle}>
        &copy; {new Date().getFullYear()} Taaza Non-Veg Market. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer