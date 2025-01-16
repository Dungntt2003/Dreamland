import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import repoApi from "api/repoApi";
import { Timeline, Button } from "antd";
import ExportToDOCX from "utils/exportToDOCX";
const ScheduleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [repo, setRepo] = useState(null);
  const [item, setItem] = useState([]);
  useEffect(() => {
    const getFullRepo = async () => {
      try {
        const response = await repoApi.getADemoRepo(id);
        setRepo(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    getFullRepo();
    const finalSchedule = JSON.parse(localStorage.getItem("finalSchedule"));
    if (finalSchedule && finalSchedule.id === id) {
      setItem(finalSchedule.events);
    }
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

  return (
    <div style={{ padding: "16px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <div>
          <Button className="button" onClick={handleExport}>
            In
          </Button>
          <Button className="button" onClick={handleReturnHomepage}>
            Trở về trang chủ
          </Button>
        </div>
      </div>
      <div
        className="header1"
        style={{ textAlign: "center", textTransform: "uppercase" }}
      >
        CHI TIẾT LỘ TRÌNH DU LỊCH {repo && repo.name}
      </div>
      <div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
        <div style={{ width: "70%" }}>
          <Timeline mode="left" items={item} />
        </div>
      </div>
    </div>
  );
};

export default ScheduleDetail;
