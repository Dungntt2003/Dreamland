import "./homepage.scss";
import { Carousel } from "antd";
import Home1 from "assets/image/home1.jpg";
import Home2 from "assets/image/home2.jpg";
import Home3 from "assets/image/home3.jpg";
import Home5 from "assets/image/home5.jpg";
import Home6 from "assets/image/home6.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHospital,
  faHotel,
  faCartShopping,
  faNewspaper,
  faLocationDot,
  faMap,
  faPlaceOfWorship,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { display } from "@mui/system";

const contentStyle = {
  margin: 0,
  height: "fit-content",
  color: "#fff",
  textAlign: "center",
  // background: "var(--background-color)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};
const Homepage = () => {
  const dataImg = [Home1, Home2, Home3, Home5, Home6];
  const itemImg = dataImg.map((item) => {
    return (
      <div key={item}>
        <h3 style={contentStyle}>
          <img src={item} alt="item" />
        </h3>
      </div>
    );
  });
  return (
    <div>
      <div className="home-menu">
        <div className="home-img">
          <Carousel autoplay>{itemImg}</Carousel>
        </div>
        <div className="home-option">
          <div className="home-item">
            <div className="home-icon">
              <FontAwesomeIcon icon={faMap} />
            </div>
            <div className="home-item-content">
              <Link
                to="/create-trip"
                className="link"
                style={{ color: "var(--text-color)" }}
              >
                Tạo lộ trình
              </Link>
            </div>
          </div>
          <div className="home-item">
            <div className="home-icon">
              <FontAwesomeIcon icon={faPlaceOfWorship} />
            </div>
            <div className="home-item-content">Địa điểm du lịch</div>
          </div>
          <div className="home-item">
            <div className="home-icon">
              <FontAwesomeIcon icon={faUtensils} />
            </div>
            <div className="home-item-content">Địa điểm ẩm thực</div>
          </div>
          <div className="home-item">
            <div className="home-icon">
              <FontAwesomeIcon icon={faHotel} />
            </div>
            <div className="home-item-content">Địa điểm nghỉ dưỡng</div>
          </div>
          <div className="home-item">
            <div className="home-icon">
              <FontAwesomeIcon icon={faHospital} />
            </div>
            <div className="home-item-content">Địa điểm tiện ích</div>
          </div>
          <div className="home-item">
            <div className="home-icon">
              <FontAwesomeIcon icon={faCartShopping} />
            </div>
            <div className="home-item-content">Gian hàng trực tuyến</div>
          </div>
          <div className="home-item">
            <div className="home-icon">
              <FontAwesomeIcon icon={faNewspaper} />
            </div>
            <div className="home-item-content">Tin tức & sự kiện</div>
          </div>
          <div className="home-item">
            <div className="home-icon">
              <FontAwesomeIcon icon={faLocationDot} />
            </div>
            <div className="home-item-content">Văn hóa địa phương</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
