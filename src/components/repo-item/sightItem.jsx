import { Card, Rate, Button } from "antd";
import Meta from "antd/es/card/Meta";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Heart from "react-heart";
import { handleLike } from "components/fun-api/like";
import { useAuth } from "context/authContext";
const SightItem = ({ item, checkSightExist, handleAddRepo, active }) => {
  const { id } = useAuth();
  const [like, setLike] = useState(active);
  const handleChange = (service_id) => {
    const params = {
      user_id: id,
      service_id,
      service_type: "sight",
    };
    handleLike(like, params);
    setLike(!like);
  };
  return (
    <Card
      hoverable
      style={{
        width: 300,
      }}
      cover={
        <div style={{ position: "relative" }}>
          <img
            alt="example"
            src={item.images[0]}
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
      <Link
        to={`/sight-seeing-detail/${item.id}`}
        className="link"
        key={item.id}
      >
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
          className="button"
          style={{
            width: "100%",
            marginTop: "16px",
            opacity: "0.5",
            cursor: "none",
          }}
          disabled
        >
          ĐÃ THÊM VÀO LỘ TRÌNH
        </Button>
      )}
    </Card>
  );
};

export default SightItem;
