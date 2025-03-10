import { Card, Rate } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import DefaultRestaurant from "assets/image/restaurant-default.png";
const { Meta } = Card;
const CardRestaurant = ({ item, link }) => {
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  return (
    <div style={{ width: "25%", padding: "8px" }}>
      <Card
        hoverable
        style={{
          // width: 300,
          margin: "0px 0 16px",
        }}
        cover={
          <img
            alt="example"
            src={item.images[0] || DefaultRestaurant}
            style={{ height: "170px" }}
          />
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
                  <Rate disabled value={getRandomInt(3, 5)} />
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

export default CardRestaurant;
