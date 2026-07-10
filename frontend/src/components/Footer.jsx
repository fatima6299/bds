import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-block">
          <h3>BDS BUSINESS</h3>
          <p>Votre partenaire de confiance pour vos achats en ligne au Sénégal.</p>
        </div>

        <div className="footer-block">
          <h4>Liens légaux</h4>
          <ul>
            <li><a href="#">Mentions légales</a></li>
            <li><a href="#">CGV</a></li>
            <li><a href="#">Politique de confidentialité</a></li>
          </ul>
        </div>

        <div className="footer-block">
          <h4>Contact & service client</h4>
          <ul>
            <li><a href="mailto:fatimatidianedia@gmail.com">fatimatidianedia@gmail.com</a></li>
            <li><a href="tel:+221701030164">+221 70 103 01 64</a></li>
            <li><Link to="/contact">Nous contacter</Link></li>
          </ul>
        </div>

        <div className="footer-block">
          <h4>Réseaux sociaux</h4>
          <ul>
            <li><a href="https://www.facebook.com/" target="_blank" rel="noreferrer">Facebook</a></li>
            <li><a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram</a></li>
            <li><a href="https://wa.me/221701030164" target="_blank" rel="noreferrer">WhatsApp</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 BDS BUSINESS. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
