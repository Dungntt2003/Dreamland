import { Card } from "antd";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faLocationPin,
  faTimeline,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { getAvaFromIndex } from "utils/getRandomAvaRepo";
import formatDate from "utils/formatDate";
const { Meta } = Card;
const CardRepo = ({ item, index }) => {
  return (
    <div style={{ width: "25%", padding: "8px" }}>
      <Card
        hoverable
        style={{
          // width: 300,
          // width: "25%",

          margin: "0px 0 16px",
        }}
        cover={
          <img
            alt="example"
            src={getAvaFromIndex(index)}
            style={{ height: "170px" }}
          />
        }
      >
        <Link to={`/schedule-detail/${item.id}`} className="link" key={item.id}>
          <Meta
            title={item.name}
            description={
              <div>
                <div>
                  <FontAwesomeIcon
                    icon={faBookmark}
                    style={{ marginRight: "12px" }}
                  />
                  {item.description}
                </div>
                <div>
                  <FontAwesomeIcon
                    icon={faLocationPin}
                    style={{ marginRight: "12px" }}
                  />
                  {item.destination ? item.destination : "Hà Nội"}
                </div>
                <div>
                  <FontAwesomeIcon
                    icon={faUsers}
                    style={{ marginRight: "12px" }}
                  />
                  {item.numberPeople}
                </div>

                <div>
                  <FontAwesomeIcon
                    icon={faTimeline}
                    style={{ marginRight: "12px" }}
                  />
                  {formatDate(item.startDate) +
                    " đến " +
                    formatDate(item.endDate)}
                </div>
              </div>
            }
          />
        </Link>
      </Card>
    </div>
  );
};

export default CardRepo;
