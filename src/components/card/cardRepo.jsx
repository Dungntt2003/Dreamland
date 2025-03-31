import { Card } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faLocationPin,
  faPen,
  faShare,
  faTimeline,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "react-tooltip";
import { getAvaFromIndex } from "utils/getRandomAvaRepo";
import formatDate from "utils/formatDate";
import { toast, ToastContainer } from "react-toastify";
const { Meta } = Card;
const CardRepo = ({ item, index }) => {
  const navigate = useNavigate();
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check this out!",
          text: "Here's a cool link for you:",
          url: `http://localhost:3000/schedule-detail/${item.id}`,
        });
      } catch (error) {
        console.error("Error sharing", error);
      }
    } else {
      navigator.clipboard
        .writeText(`http://localhost:3000/schedule-detail/${item.id}`)
        .then(() => {
          toast.info("Link đã được copy vào clipboard", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        });
    }
  };
  const handleEdit = () => {
    navigate(`/schedule/${item.id}`);
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
              src={getAvaFromIndex(index)}
              style={{ height: "170px", width: "100%" }}
            />
            <div
              style={{
                position: "absolute",
                top: "8px",
                right: "36px",
                width: "24px",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  color: "var(--primary-color)",
                  fontSize: "18px",
                }}
              >
                <FontAwesomeIcon
                  icon={faShare}
                  onClick={handleShare}
                  data-tooltip-id="tooltip-share"
                  data-tooltip-content="Copy link"
                />
                <FontAwesomeIcon
                  icon={faPen}
                  onClick={handleEdit}
                  style={{ marginLeft: "16px" }}
                  data-tooltip-id="tooltip-edit"
                  data-tooltip-content="Chỉnh sửa"
                />
              </div>
            </div>
          </div>
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
      <Tooltip id="tooltip-share" />
      <Tooltip id="tooltip-edit" />
      <ToastContainer />
    </div>
  );
};

export default CardRepo;
