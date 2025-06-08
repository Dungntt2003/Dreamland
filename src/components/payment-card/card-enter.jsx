import { Card, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faMoneyBill } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
const { Meta } = Card;

const CardPaymentEnter = ({ item, link, repoId, checkPayment }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/payment-enter?repoId=${repoId}&serviceId=${item.id}`);
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
              alt="entertainment payment"
              src={item.images[0]}
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
              <div className="card-repo-info-item">
                <FontAwesomeIcon
                  icon={faMoneyBill}
                  className="card-repo-info-icon"
                />
                <span className="card-repo-info-text">
                  {item.price ? item.price : "100.000"}
                </span>
              </div>
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

export default CardPaymentEnter;
