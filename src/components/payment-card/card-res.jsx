import { Card, Rate, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import RestaurantDefaultImg from "assets/image/restaurant-default.png";
const { Meta } = Card;

const CardPaymentRestaurant = ({ item, link, repoId, checkPayment }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/payment-restaurant?repoId=${repoId}&serviceId=${item.id}`);
  };

  const handleViewOrder = () => {
    navigate(`/payment-info?repoId=${repoId}&serviceId=${item.id}`);
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
              src={item.images[0] ? item.images[0] : RestaurantDefaultImg}
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
                {checkPayment === true ? (
                  <>
                    <Button className="button" onClick={handleViewOrder}>
                      Xem đặt trước
                    </Button>
                  </>
                ) : (
                  <>
                    <Button className="button" onClick={handleClick}>
                      Đặt bàn
                    </Button>
                  </>
                )}
              </div>
            </div>
          }
        />
      </Card>
    </div>
  );
};

export default CardPaymentRestaurant;
