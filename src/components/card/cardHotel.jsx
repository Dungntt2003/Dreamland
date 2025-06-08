import "./cardRepo.scss";
import { Card, Rate } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import DefaultHotel from "assets/image/hotel-default.jpg";
import { useState } from "react";
import Heart from "react-heart";
import { handleLike } from "components/fun-api/like";
import { useAuth } from "context/authContext";
const { Meta } = Card;
const CardHotel = ({ item, link, active }) => {
  const { id } = useAuth();
  const [like, setLike] = useState(active);
  const handleChange = (service_id) => {
    const params = {
      user_id: id,
      service_id,
      service_type: "hotel",
    };
    handleLike(like, params);
    setLike(!like);
  };
  return (
    <div className="card-repo-container">
      <Card
        hoverable
        className="card-repo"
        cover={
          <div className="card-repo-cover">
            <img
              alt="hotel image"
              src={item.images[0] || DefaultHotel}
              className="card-repo-image"
            />
            <div className="card-repo-actions">
              <div className="card-repo-action-icon">
                <Heart
                  isActive={like}
                  onClick={() => handleChange(item.id)}
                  animationScale={1.25}
                />
              </div>
            </div>
          </div>
        }
      >
        <Link
          to={`/${link}/${item.id}`}
          className="card-repo-link"
          key={item.id}
        >
          <Meta
            title={item.name}
            description={
              <div className="card-repo-description">
                <div className="card-repo-info-item-address">
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    className="card-repo-info-icon"
                  />
                  <span className="card-repo-info-text card-repo-info-address">
                    {item.address}
                  </span>
                </div>
                <div className="card-repo-info-item">
                  <Rate disabled defaultValue={item.rate} />
                </div>
              </div>
            }
          />
        </Link>
      </Card>
    </div>
  );
};

export default CardHotel;
