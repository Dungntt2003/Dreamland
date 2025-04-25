import { Card, Rate, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faMoneyBill } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
const { Meta } = Card;

const CardPaymentEnter = ({ item, link, repoId }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/payment-enter?repoId=${repoId}&serviceId=${item.id}`);
  };
  return (
    <div style={{ width: "25%", padding: "8px" }}>
      <Card
        hoverable
        style={{
          margin: "0px 0 16px",
        }}
        cover={
          <div style={{ position: "relative" }}>
            <img
              alt="example"
              src={item.images[0]}
              style={{ height: "170px", width: "100%" }}
            />
          </div>
        }
      >
        <Meta
          title={
            <Link to={`/${link}/${item.id}`} className="link" key={item.id}>
              {item.name}
            </Link>
          }
          description={
            <div>
              <div>
                <FontAwesomeIcon
                  icon={faMoneyBill}
                  style={{ marginRight: "12px" }}
                />
                {item.price ? item.price : "100.000"}
              </div>
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
                  justifyContent: "space-between",
                  margin: "8px 0",
                }}
              >
                <Rate disabled defaultValue={item.rate} />
                <Button className="button" onClick={handleClick}>
                  Đặt vé
                </Button>
              </div>
            </div>
          }
        />
      </Card>
    </div>
  );
};

export default CardPaymentEnter;
