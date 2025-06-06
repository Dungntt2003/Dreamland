import "./footer.scss";
import Logo from "assets/image/logo.png";
import GGPlay from "assets/image/ggplay.webp";
import IOS from "assets/image/ios.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faEarthAmericas } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
const Footer = () => {
  const { t } = useTranslation();
  return (
    <div className="footer-container">
      <div className="footer-item-wrap">
        <div className="footer-item">
          {/* <img src={Logo} alt="logo" className="footer-logo" /> */}
        </div>
        <div className="footer-item">{t("address")}</div>
        <div className="footer-item">{t("phone")}</div>
        <div className="footer-item">{t("email")}</div>
      </div>
      <div className="footer-item-wrap">
        <div className="footer-header header3">{t("another_page")}</div>
        <div className="footer-item">{t("promote")}</div>
        <div className="footer-item">{t("create_trip")}</div>
        <div className="footer-item">{t("guide")}</div>
        <div className="footer-item">{t("contact")}</div>
      </div>
      <div className="footer-item-wrap">
        <div className="footer-header header3">{t("sitemap")}</div>
        <div className="footer-item">{t("place_attract")}</div>
        <div className="footer-item">{t("util_place")}</div>
        <div className="footer-item">{t("culinary")}</div>
        <div className="footer-item">{t("accommodation")}</div>
        <div className="footer-item">{t("special_food")}</div>
        <div className="footer-item">{t("news")}</div>
      </div>
      <div className="footer-item-wrap">
        <div className="footer-header header3">{t("account")}</div>
        <div className="footer-item">{t("register")}</div>
        <div className="footer-item">{t("login")}</div>
        <div className="footer-item">{t("wishlist")}</div>
        <div className="footer-item">{t("cart")}</div>
      </div>
      <div className="footer-item-wrap">
        <div className="footer-item-container">
          <div className="footer-header header3">{t("follow")}</div>
          <div className="footer-item">
            <FontAwesomeIcon className="footer-icon" icon={faEarthAmericas} />
            {t("e-port")}
          </div>
          <div className="footer-item">
            <FontAwesomeIcon className="footer-icon" icon={faFacebook} />
            Facebook
          </div>
        </div>
        <div className="footer-item-container">
          <div className="footer-header header3">{t("download")}</div>
          <div className="footer-download">
            <img src={GGPlay} alt="gg play" className="footer-download-img" />
            <img src={IOS} alt="ios" className="footer-download-img" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
