import "./footer.scss";
import Logo from "assets/image/logo.png";
import GGPlay from "assets/image/ggplay.webp";
import IOS from "assets/image/ios.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faEarthAmericas } from "@fortawesome/free-solid-svg-icons";
const Footer = () => {
  return (
    <div className="footer-container">
      <div className="footer-item-wrap">
        <div className="footer-item">
          <img src={Logo} alt="logo" className="footer-logo" />
        </div>
        <div className="footer-item">Địa chỉ: Đà Lạt</div>
        <div className="footer-item">Số điện thoại: 09352192002</div>
        <div className="footer-item">Email: dalat0dreamland@gmail.com</div>
      </div>
      <div className="footer-item-wrap">
        <div className="footer-header header3">Trang khác</div>
        <div className="footer-item">Chương trình khuyến mãi</div>
        <div className="footer-item">Tạo lộ trình</div>
        <div className="footer-item">Sách du lịch Đà Lạt</div>
        <div className="footer-item">Liên hệ</div>
      </div>
      <div className="footer-item-wrap">
        <div className="footer-header header3">Sơ đồ trang web</div>
        <div className="footer-item">Địa điểm du lịch</div>
        <div className="footer-item">Địa điểm tiện ích</div>
        <div className="footer-item">Địa điểm ẩm thực</div>
        <div className="footer-item">Địa điểm nghỉ dưỡng</div>
        <div className="footer-item">Sản phẩm đặc sản</div>
        <div className="footer-item">Tin tức & sự kiện</div>
      </div>
      <div className="footer-item-wrap">
        <div className="footer-header header3">Tài khoản của tôi</div>
        <div className="footer-item">Đăng nhập</div>
        <div className="footer-item">Đăng ký</div>
        <div className="footer-item">Danh sách yêu thích</div>
        <div className="footer-item">Giỏ hàng của tôi</div>
      </div>
      <div className="footer-item-wrap">
        <div className="footer-item-container">
          <div className="footer-header header3">Theo dõi chúng tôi</div>
          <div className="footer-item">
            <FontAwesomeIcon className="footer-icon" icon={faEarthAmericas} />
            Cổng thông tin điện tử
          </div>
          <div className="footer-item">
            <FontAwesomeIcon className="footer-icon" icon={faFacebook} />
            Facebook
          </div>
        </div>
        <div className="footer-item-container">
          <div className="footer-header header3">Tải xuống ứng dụng</div>
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
