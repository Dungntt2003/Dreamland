import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import repoApi from "api/repoApi";
import { Timeline, Button } from "antd";
import ExportToDOCX from "utils/exportToDOCX";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPrint, faShare } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import reverseFormat from "utils/reverseFormatRepo";
const ScheduleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const calendarRef = useRef(null);
  const [repo, setRepo] = useState(null);
  const [events, setEvents] = useState([]);
  const [item, setItem] = useState([]);
  const [date, setDate] = useState(null);
  useEffect(() => {
    const getFullRepo = async () => {
      try {
        const response = await repoApi.getADemoRepo(id);
        // console.log(response);
        setDate({
          start: new Date(response.data.data.startDate)
            .toISOString()
            .split("T")[0],
          end: new Date(
            new Date(response.data.data.endDate).setDate(
              new Date(response.data.data.endDate).getDate() + 1
            )
          )
            .toISOString()
            .split("T")[0],
        });
        setRepo(response.data.data);
        setItem(response.data.data.plan);
        setEvents(reverseFormat(response.data.data.plan));
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

  const handleEdit = () => {
    navigate(`/schedule/${id}`);
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
          <Button className="button" onClick={handleEdit}>
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
      <div style={{ display: "flex", width: "100%" }}>
        <div style={{ width: "50%", marginTop: "24px", height: "80vh" }}>
          <Timeline mode="left" items={item} />
        </div>
        <div id="kt_docs_fullcalendar_drag" style={{ width: "50%" }}>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
            }}
            // editable={true}
            // droppable={true}
            initialView="timeGridDay"
            // initialDate="2025-01-20"
            validRange={{
              start: date ? date.start : null,
              end: date ? date.end : null,
            }}
            events={events}
            slotMinTime="07:00:00"
            slotMaxTime="22:00:00"
            // eventReceive={handleEventReceive}
            // eventContent={renderEventContent}
            timeZone="Asia/Ho_Chi_Minh"
            locale="vi"
            height="80vh"
            slotDuration="01:00:00"
          />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ScheduleDetail;
