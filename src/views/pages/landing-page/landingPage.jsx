import "./landingPage.scss";
import landingPage from "assets/image/landing_page.jpg";
import land2 from "assets/image/land2.jpg";
import land3 from "assets/image/land3.jpg";
import land4 from "assets/image/land4.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { Button } from "antd";
import { Link } from "react-router-dom";
const LandingPage = () => {
  return (
    <div
      style={{
        backgroundColor: "var(--background-color)",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        padding: "0 32px",
      }}
    >
      <div className="landing-container" style={{ display: "flex" }}>
        <div
          className="landing-content"
          style={{ width: "50%", display: "flex", alignItems: "center" }}
        >
          <div className="landing-wrap">
            <h2 className="landing-header">
              Chào mừng đến với Dalat Dreamland
            </h2>
            <div className="landing-des">
              <div className="landing-item">
                <FontAwesomeIcon icon={faCheck} className="landing-icon" />
                Thông tin địa điểm nổi tiếng
              </div>
              <div className="landing-item">
                <FontAwesomeIcon icon={faCheck} className="landing-icon" />
                Cẩm nang du lịch
              </div>
              <div className="landing-item">
                <FontAwesomeIcon icon={faCheck} className="landing-icon" />
                Thông tin khách sạn, homestay, nhà hàng, quán ăn
              </div>
              <div className="landing-item">
                <FontAwesomeIcon icon={faCheck} className="landing-icon" />
                Tạo lộ trình du lịch cho riêng mình
              </div>
              <div className="landing-item">
                <FontAwesomeIcon icon={faCheck} className="landing-icon" />
                Viết blog lưu giữ kỉ niệm đẹp khi đi du lịch tại Đà Lạt
              </div>
            </div>
            <Link to="/register">
              <Button className="button landing-btn">
                BẮT ĐẦU KHÁM PHÁ NGAY
              </Button>
            </Link>
          </div>
        </div>
        <div
          className="landing-img"
          style={{ width: "50%", display: "flex", flexWrap: "wrap" }}
        >
          <img
            src={landingPage}
            alt="land1"
            style={{ width: "45%", borderRadius: "25px", margin: "8px 16px" }}
            className="landing-img"
          />
          <img
            src={land2}
            style={{ width: "45%", borderRadius: "25px", margin: "8px 16px" }}
            className="landing-img"
            alt="land2"
          />
          <img
            src={land3}
            style={{ width: "45%", borderRadius: "25px", margin: "8px 16px" }}
            className="landing-img"
            alt="land3"
          />
          <img
            src={land4}
            style={{ width: "45%", borderRadius: "25px", margin: "8px 16px" }}
            className="landing-img"
            alt="land4"
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
