import { Card, Rate } from "antd";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
const { Meta } = Card;
const CardSight = ({ sight }) => {
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  return (
    <div>
      <Card
        hoverable
        style={{
          width: 300,
          margin: "0px 0 16px",
        }}
        cover={
          <img
            alt="example"
            src={`http://localhost:8000/uploads/${sight.images[0]}`}
            style={{ height: "170px" }}
          />
        }
      >
        <Link
          to={`/sight-seeing-detail/${sight.id}`}
          className="link"
          key={sight.id}
        >
          <Meta
            title={sight.name}
            description={
              <div>
                <div className="truncate-2-lines">
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    style={{ marginRight: "12px" }}
                  />
                  {sight.address}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: "8px 0",
                  }}
                >
                  <Rate disabled value={getRandomInt(3, 5)} />
                </div>
              </div>
            }
          />
        </Link>
      </Card>
    </div>
  );
};

export default CardSight;
