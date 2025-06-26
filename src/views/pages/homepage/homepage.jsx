import "./homepage.scss";
import { Button, Select } from "antd";
import { useEffect, useState } from "react";
import Home1 from "assets/image/home1.jpg";
import Home2 from "assets/image/home2.jpg";
import Home3 from "assets/image/home3.jpg";
import Home5 from "assets/image/home5.jpg";
import Home6 from "assets/image/home6.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import publicApi from "api/publicApi";
import iconSight from "assets/image/iconSight.jpeg";
import iconEnter from "assets/image/iconEnter.jpeg";
import iconHotel from "assets/image/iconHotel.jpeg";
import iconRes from "assets/image/iconRes.jpeg";
import ListDisplay from "components/list-display/list-display";
import sightApi from "api/sightApi";
import CardSight from "components/card/cardSight";
import Slider from "assets/image/slider.jpg";

const contentStyle = {
  margin: 0,
  height: "fit-content",
  color: "#fff",
  textAlign: "center",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};
const Homepage = () => {
  const navigate = useNavigate();
  const [provinces, setProvinces] = useState([]);
  const [sight, setSight] = useState([]);
  useEffect(() => {
    const getProvinces = async () => {
      try {
        const response = await publicApi.getListProvinces();
        setProvinces(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getProvinces();
    const getSight = async () => {
      try {
        const response = await sightApi.getAllSights();
        setSight(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getSight();
  }, []);

  const options = provinces.map((item) => {
    return { value: item.name, label: item.name };
  });
  const handleClick = () => {
    navigate("/create-trip");
  };
  const destinations = [
    {
      id: 1,
      name: "QUẢNG NINH",
      image:
        "https://i.pinimg.com/736x/df/25/5c/df255c66acdd9b286d8d5f2026f4c7f5.jpg",
      className: "card-large",
    },
    {
      id: 2,
      name: "HÀ GIANG",
      image:
        "https://i.pinimg.com/736x/e1/24/b1/e124b1393750f24c6356e560e59ca83c.jpg",
      className: "card-medium",
    },
    {
      id: 3,
      name: "LÀO CAI",
      image:
        "https://i.pinimg.com/736x/fd/a6/47/fda647a486d342a49c0bdd78be9cefb2.jpg",
      className: "card-large-right",
      hasButton: true,
    },
    {
      id: 4,
      name: "NINH BÌNH",
      image:
        "https://i.pinimg.com/736x/e9/64/84/e96484d710fa037a3fcf335e8d3c0f8a.jpg",
      className: "card-medium",
    },
    {
      id: 5,
      name: "YÊN BÁI",
      image:
        "https://i.pinimg.com/736x/ab/12/13/ab121393649129a3b06278c63ec1d5d5.jpg",
      className: "card-medium",
    },
  ];

  return (
    <div>
      <div className="image-overlay-container">
        <div className="image-wrapper">
          <img src={Slider} alt="Background" className="background-image" />
        </div>
        <div className="home-menu content-overlay">
          <div className="home-content">
            <div>
              <p className="home-content-title">Bạn muốn đi đâu ?</p>

              <Button className="button" onClick={handleClick}>
                Nhấn ngay để bắt đầu <FontAwesomeIcon icon={faArrowRight} />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="home-list-service">
        <div className="home-list-wrap">
          <div className="home-list-item">
            <div>
              <img
                src={iconSight}
                alt="icon sight"
                onClick={() => navigate("/sight")}
              />
            </div>
            <div>Tham quan</div>
          </div>
          <div className="home-list-item">
            <div>
              <img
                src={iconEnter}
                alt="icon enter"
                onClick={() => navigate("/entertaiment")}
              />
            </div>
            <div>Vui chơi</div>
          </div>
          <div className="home-list-item">
            <div>
              <img
                src={iconRes}
                alt="icon res"
                onClick={() => navigate("/restaurant")}
              />
            </div>
            <div>Nhà hàng</div>
          </div>
          <div className="home-list-item">
            <div>
              <img
                src={iconHotel}
                alt="icon hotel"
                onClick={() => navigate("/hotel")}
              />
            </div>
            <div>Khách sạn</div>
          </div>
        </div>
      </div>
      <div className="home-display-service">
        <div className="home-content-title">KHÁM PHÁ NGAY SMART TRIP</div>
        <div>
          <ListDisplay
            listServices={sight.slice(0, 4)}
            CardComponent={CardSight}
            link={"sight-seeing-detail"}
          />
        </div>
        <div className="home-display-btn">
          <Button className="button" onClick={() => navigate("/sight")}>
            Xem tất cả
          </Button>
        </div>
      </div>
      <div className="home-display-service">
        <div className="home-content-title">ĐIỂM ĐẾN YÊU THÍCH</div>
        <div className="travel-container">
          <div className="travel-grid">
            {destinations.map((destination) => (
              <div
                key={destination.id}
                className={`travel-card ${destination.className}`}
                style={{ backgroundImage: `url(${destination.image})` }}
              >
                <div className="card-overlay">
                  <div className="card-content">
                    <h3 className="destination-name">{destination.name}</h3>
                    {destination.hasButton && (
                      <button className="explore-btn">Khám phá</button>
                    )}
                  </div>
                  {destination.id === 3 && (
                    <div className="flag-icon">
                      <div className="vietnam-flag"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
