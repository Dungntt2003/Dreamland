import { Card, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import HotelDefaultImg from "assets/image/hotel-default.jpg";
const { Meta } = Card;

const CardPaymentHotel = ({ item, link, repoId, checkPayment }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/payment-hotel?repoId=${repoId}&serviceId=${item.id}`);
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
              alt="hotel payment"
              src={item.images[0] ? item.images[0] : HotelDefaultImg}
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
                      Xem vé
                    </Button>
                  </>
                ) : (
                  <>
                    <Button className="button" onClick={handleClick}>
                      Đặt vé
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

export default CardPaymentHotel;
