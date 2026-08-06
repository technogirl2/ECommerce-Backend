import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <p className="footer-line">
        <span className="footer-logo">Tastella</span>
        <span className="footer-tagline">
          Snacks and drinks from around the world, delivered.
        </span>
        <span className="footer-copyright">
          © {new Date().getFullYear()} Tastella. All rights reserved.
        </span>
      </p>
    </footer>
  )
}

export default Footer
