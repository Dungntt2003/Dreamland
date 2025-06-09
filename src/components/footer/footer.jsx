import "./footer.scss";
import GGPlay from "assets/image/ggplay.webp";
import IOS from "assets/image/ios.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import {
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <div className="footer-container">
      <div className="footer-section">
        <div className="footer-logo">
          <h3 className="brand-name">Smart Trip</h3>
          <p className="brand-tagline">{t("smart_trip")}</p>
        </div>

        <div className="contact-info">
          <div className="contact-item">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="contact-icon" />
            <span>Hà Nội, Việt Nam</span>
          </div>
          <div className="contact-item">
            <FontAwesomeIcon icon={faPhone} className="contact-icon" />
            <span>+84 123 456 789</span>
          </div>
          <div className="contact-item">
            <FontAwesomeIcon icon={faEnvelope} className="contact-icon" />
            <span>info@smarttrip.com</span>
          </div>
        </div>
      </div>

      <div className="footer-section">
        <h4 className="section-title">{t("quick_links")}</h4>
        <ul className="footer-links">
          <li>
            <a href="#">{t("place_attract")}</a>
          </li>
          <li>
            <a href="#">{t("accommodation")}</a>
          </li>
          <li>
            <a href="#">{t("culinary")}</a>
          </li>
          <li>
            <a href="#">{t("guide")}</a>
          </li>
        </ul>
      </div>

      <div className="footer-section">
        <h4 className="section-title">{t("account")}</h4>
        <ul className="footer-links">
          <li>
            <a href="#">{t("login")}</a>
          </li>
          <li>
            <a href="#">{t("register")}</a>
          </li>
          <li>
            <a href="#">{t("profile")}</a>
          </li>
          <li>
            <a href="#">{t("wishlist")}</a>
          </li>
        </ul>
      </div>

      <div className="footer-section">
        <h4 className="section-title">{t("connect_with_us")}</h4>

        <div className="social-links">
          <a href="#" className="social-link facebook">
            <FontAwesomeIcon icon={faFacebook} />
          </a>
          <a href="#" className="social-link instagram">
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a href="#" className="social-link twitter">
            <FontAwesomeIcon icon={faTwitter} />
          </a>
        </div>

        <div className="download-section">
          <div className="download-buttons">
            <img src={GGPlay} alt="Google Play" className="download-btn" />
            <img src={IOS} alt="App Store" className="download-btn" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
