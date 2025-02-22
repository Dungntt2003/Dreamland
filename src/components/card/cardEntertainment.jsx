import { Card, Rate } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faMoneyBill } from "@fortawesome/free-solid-svg-icons";
const { Meta } = Card;
const CardEntertainment = ({ enter }) => {
  return (
    <div>
      <Card
        hoverable
        style={{
          width: 300,
        }}
        cover={
          <img
            alt="example"
            src={`http://localhost:8000/uploads/${enter.images[0]}`}
            style={{ height: "170px" }}
          />
        }
      >
        <Link
          to={`/entertainment-detail/${enter.id}`}
          className="link"
          key={enter.id}
        >
          <Meta
            title={enter.name}
            description={
              <div>
                <div>
                  <FontAwesomeIcon
                    icon={faMoneyBill}
                    style={{ marginRight: "12px" }}
                  />
                  {enter.price ? enter.price : "100.000"}
                </div>
                <div className="truncate-2-lines">
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    style={{ marginRight: "12px" }}
                  />
                  {enter.address}
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

export default CardEntertainment;
