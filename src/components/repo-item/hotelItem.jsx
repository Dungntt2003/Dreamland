import { Card, Rate, Button } from "antd";
import Meta from "antd/es/card/Meta";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Heart from "react-heart";
import { handleLike } from "components/fun-api/like";
import { useAuth } from "context/authContext";
import DefaultHotel from "assets/image/hotel-default.jpg";
const HotelItem = ({
  item,
  checkSightExist,
  handleAddRepo,
  active,
  handleRemoveService,
}) => {
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
    <div
      className={
        active === true ? "card-repo-container-v3" : "card-repo-container-v2"
      }
    >
      <Card
        hoverable
        className="card-repo"
        cover={
          <div className="card-repo-cover">
            <img
              alt="hotel item"
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
          to={`/hotel-detail/${item.id}`}
          className="card-repo-link"
          key={item.id}
        >
          <Meta
            title={item.name}
            description={
              <div>
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
        {checkSightExist(item.id) === false ? (
          <Button
            className="button"
            style={{ width: "100%", marginTop: "16px" }}
            onClick={() => handleAddRepo(item.id)}
          >
            THÊM VÀO LỘ TRÌNH
          </Button>
        ) : (
          <Button
            className="button-v2"
            style={{
              width: "100%",
              marginTop: "16px",
            }}
            onClick={() => handleRemoveService(item.id)}
          >
            LOẠI KHỎI LỘ TRÌNH
          </Button>
        )}
      </Card>
    </div>
  );
};

export default HotelItem;
