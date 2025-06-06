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
    <div style={{ width: "25%", padding: "8px" }}>
      <Card
        hoverable
        style={{
          // width: 300,
          margin: "0px 0 16px",
          borderRadius: "15px",
        }}
        cover={
          <div style={{ position: "relative" }}>
            <img
              alt="example"
              src={item.images[0] || DefaultHotel}
              style={{ height: "170px", width: "100%" }}
            />
            <div
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                width: "24px",
                zIndex: 1,
              }}
            >
              <Heart
                isActive={like}
                onClick={() => handleChange(item.id)}
                animationScale={1.25}
                style={{ marginBottom: "1rem" }}
              />
            </div>
          </div>
        }
      >
        <Link to={`/${link}/${item.id}`} className="link" key={item.id}>
          <Meta
            title={item.name}
            description={
              <div>
                <div className="truncate-2-lines">
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    style={{ marginRight: "12px" }}
                  />
                  {item.address}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: "8px 0",
                  }}
                >
                  <Rate disabled defaultValue={item.rate} />
                  {/* <div
                    style={{ color: "var(--text-color)", marginLeft: "12px" }}
                  >{`${getRandomInt(3, 5)}/5`}</div> */}
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
