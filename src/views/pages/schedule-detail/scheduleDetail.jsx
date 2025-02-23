import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import repoApi from "api/repoApi";
import { Timeline, Button } from "antd";
import ExportToDOCX from "utils/exportToDOCX";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPrint, faShare } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
const ScheduleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [repo, setRepo] = useState(null);
  const [item, setItem] = useState([]);
  useEffect(() => {
    const getFullRepo = async () => {
      try {
        const response = await repoApi.getADemoRepo(id);
        // console.log(response);
        setRepo(response.data.data);
        setItem(response.data.data.plan);
      } catch (error) {
        console.error(error);
      }
    };
    getFullRepo();
  }, [id]);

  const handleExport = () => {
    const resultString = item
      .map((event) => `${event.label}: ${event.children}`)
      .join("\n");
    // console.log(resultString);
    ExportToDOCX(resultString);
  };

  const handleReturnHomepage = () => {
    navigate("/homepage");
  };

  const handleShare = async () => {
    const link = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check this out!",
          text: "Here's a cool link for you:",
          url: link,
        });
      } catch (error) {
        console.error("Error sharing", error);
      }
    } else {
      navigator.clipboard.writeText(link).then(() => {
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

  return (
    <div style={{ padding: "16px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <div>
          <Button className="button">
            <FontAwesomeIcon icon={faPen} />
            Chỉnh sửa
          </Button>
          <Button className="button" onClick={handleShare}>
            <FontAwesomeIcon icon={faShare} />
            Chia sẻ
          </Button>
          <Button className="button" onClick={handleExport}>
            <FontAwesomeIcon icon={faPrint} />
            In
          </Button>
          <Button className="button" onClick={handleReturnHomepage}>
            Trở về trang chủ
          </Button>
        </div>
      </div>
      <div
        className="header2"
        style={{ textAlign: "center", textTransform: "uppercase" }}
      >
        CHI TIẾT LỘ TRÌNH DU LỊCH {repo && repo.name}
      </div>
      <div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
        <div style={{ width: "70%" }}>
          <Timeline mode="left" items={item} />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ScheduleDetail;
