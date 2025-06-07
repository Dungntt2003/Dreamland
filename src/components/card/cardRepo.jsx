import "./cardRepo.scss";
import { Card } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faEye,
  faLocationPin,
  faPen,
  faShare,
  faTimeline,
  faUsers,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "react-tooltip";
import { getAvaFromIndex } from "utils/getRandomAvaRepo";
import formatDate from "utils/formatDate";
import { toast, ToastContainer } from "react-toastify";
import repoApi from "api/repoApi";

const { Meta } = Card;

const CardRepo = ({ item, index, loadRepos }) => {
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

  const handleHidden = () => {
    const updateStatus = async () => {
      try {
        const response = await repoApi.updateStatusRepo(item.id);
        console.log(response);
        await loadRepos();
      } catch (error) {
        console.log(error);
      }
    };
    updateStatus();
  };

  return (
    <div className="card-repo-container">
      <Card
        hoverable
        className="card-repo"
        cover={
          <div className="card-repo-cover">
            <img
              alt="Schedule Image"
              src={getAvaFromIndex(index)}
              className="card-repo-image"
            />

            {/* Status Badge */}
            <div
              className={`card-repo-status-badge ${
                item.isHidden ? "hidden" : "visible"
              }`}
            >
              {item.isHidden ? "Ẩn" : "Hiển thị"}
            </div>

            {/* Action Icons */}
            <div className="card-repo-actions">
              <div
                className="card-repo-action-icon share"
                onClick={handleShare}
                data-tooltip-id="tooltip-share"
                data-tooltip-content="Copy link"
              >
                <FontAwesomeIcon icon={faShare} />
              </div>

              <div
                className="card-repo-action-icon edit"
                onClick={handleEdit}
                data-tooltip-id="tooltip-edit"
                data-tooltip-content="Chỉnh sửa"
              >
                <FontAwesomeIcon icon={faPen} />
              </div>

              <div
                className={`card-repo-action-icon ${
                  item.isHidden ? "visible" : "hidden"
                }`}
                onClick={handleHidden}
                data-tooltip-id="tooltip-hidden"
                data-tooltip-content={
                  item.isHidden ? "Hiển thị" : "Ẩn lộ trình"
                }
              >
                <FontAwesomeIcon icon={item.isHidden ? faEye : faEyeSlash} />
              </div>
            </div>
          </div>
        }
      >
        <Link to={`/schedule-detail/${item.id}`} className="card-repo-link">
          <Meta
            title={item.name}
            description={
              <div className="card-repo-description">
                <div className="card-repo-info-item">
                  <FontAwesomeIcon
                    icon={faBookmark}
                    className="card-repo-info-icon"
                  />
                  <span className="card-repo-info-text">
                    {item.description}
                  </span>
                </div>

                <div className="card-repo-info-item">
                  <FontAwesomeIcon
                    icon={faLocationPin}
                    className="card-repo-info-icon"
                  />
                  <span className="card-repo-info-text">
                    {item.destination ? item.destination : "Hà Nội"}
                  </span>
                </div>

                <div className="card-repo-info-item">
                  <FontAwesomeIcon
                    icon={faUsers}
                    className="card-repo-info-icon"
                  />
                  <span className="card-repo-info-text">
                    {item.numberPeople} người
                  </span>
                </div>

                <div className="card-repo-info-item">
                  <FontAwesomeIcon
                    icon={faTimeline}
                    className="card-repo-info-icon"
                  />
                  <span className="card-repo-info-text">
                    {formatDate(item.startDate)} đến {formatDate(item.endDate)}
                  </span>
                </div>
              </div>
            }
          />
        </Link>
      </Card>

      <Tooltip id="tooltip-share" />
      <Tooltip id="tooltip-edit" />
      <Tooltip id="tooltip-hidden" />
      <ToastContainer />
    </div>
  );
};

export default CardRepo;
