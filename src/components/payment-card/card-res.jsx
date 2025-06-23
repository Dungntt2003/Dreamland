import { Card, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import RestaurantDefaultImg from "assets/image/restaurant-default.png";
const { Meta } = Card;

const CardPaymentRestaurant = ({ item, link, repoId, checkPayment, date }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/payment-restaurant?repoId=${repoId}&serviceId=${item.id}`);
  };

  const handleViewOrder = () => {
    navigate(`/payment-info?repoId=${repoId}&serviceId=${item.id}`);
  };

  return (
    <div className="card-repo-container">
      <Card
        hoverable
        className="card-repo"
        cover={
          <div className="card-repo-cover">
            <img
              alt="restauant payment"
              src={item.images[0] ? item.images[0] : RestaurantDefaultImg}
              className="card-repo-image"
            />
          </div>
        }
      >
        <Meta
          title={
            <Link
              to={`/${link}/${item.id}`}
              className="card-repo-link"
              key={item.id}
            >
              {item.name}
            </Link>
          }
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
                {checkPayment === true ? (
                  <>
                    <Button className="button" onClick={handleViewOrder}>
                      Xem đặt trước
                    </Button>
                  </>
                ) : (
                  <>
                    {new Date(date) >= new Date() && (
                      <Button className="button" onClick={handleClick}>
                        Đặt bàn
                      </Button>
                    )}
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
