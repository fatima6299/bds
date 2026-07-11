import { Link } from 'react-router-dom';
import { WHATSAPP_NUMBER } from '../utils/payment';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-block">
          <h3>BDS BUSINESS</h3>
          <p>Votre partenaire de confiance pour vos achats en ligne au Sénégal.</p>
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
            <li><Link to="/"><i className="fas fa-globe"></i> Notre site web</Link></li>
            <li><a href="https://www.linkedin.com/in/fatimata-tidiane-dia-9166aa270/" target="_blank" rel="noreferrer"><i className="fab fa-linkedin"></i> LinkedIn</a></li>
            <li><a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer"><i className="fab fa-whatsapp"></i> WhatsApp</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 BDS BUSINESS. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
