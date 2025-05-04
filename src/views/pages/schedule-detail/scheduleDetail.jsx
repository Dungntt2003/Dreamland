import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import repoApi from "api/repoApi";
import { Timeline, Button, Select, FloatButton, Modal } from "antd";
import ExportToDOCX from "utils/exportToDOCX";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faPrint,
  faMap,
  faBook,
  faMoneyBill,
} from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import reverseFormat from "utils/reverseFormatRepo";
import aiApi from "api/aiApi";
import Markdown from "react-markdown";
import TextToSpeech from "components/text-to-speech/TTP";
const ScheduleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const calendarRef = useRef(null);
  const [repo, setRepo] = useState(null);
  const [events, setEvents] = useState([]);
  const [item, setItem] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState(null);
  const [experience, setExperience] = useState(null);
  const [query, setQuery] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getFullRepo = async () => {
      try {
        const response = await repoApi.getADemoRepo(id);
        // console.log(response);
        const listServices = response.data.data.plan
          .map((item) => {
            return `${item.label} ${item.children}`;
          })
          .join(". ");
        setQuery(
          `Du lịch ${
            response.data.data.destination
              ? response.data.data.destination
              : "Hà Giang"
          } với lộ trình như sau: ${listServices}`
        );
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

  const showModal = () => {
    setIsModalOpen(true);
    setExperience(null);
    setLoading(true);
    const getAiGen = async () => {
      try {
        const params = {
          itinerary: query,
        };
        const response = await aiApi.getDetailWithAI(params);
        console.log(response);
        setExperience(response.data.data);
      } catch (error) {
        console.log(error);
        setExperience("Lỗi khi lấy dữ liệu từ AI.");
      } finally {
        setLoading(false);
      }
    };
    getAiGen();
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleExport = () => {
    const resultString = item
      .map((event) => `${event.label}: ${event.children}`)
      .join("\n");
    // console.log(resultString);
    ExportToDOCX(resultString);
  };
  const handleMap = () => {
    navigate(`/repo-map/${id}`);
  };

  const handleReturnHomepage = () => {
    navigate("/homepage");
  };

  const handleEdit = () => {
    navigate(`/schedule-edit/${id}`);
  };

  const handlePayment = () => {
    navigate(`/payment-service/${id}`);
  };

  const handleShareLink = (value) => {
    if (value === "link") {
      handleShare();
    } else if (value === "facebook") {
      const url = "https://63stravel.com/vn/travel";
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`;
      window.open(facebookUrl, "_blank");
    }
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
          alignItems: "center",
        }}
      >
        <div>
          {/* <Button className="button" onClick={handleShare}>
            <FontAwesomeIcon icon={faShare} />
            Chia sẻ
          </Button> */}
          <Select
            style={{
              width: "200px",
            }}
            placeholder="Chia sẻ"
            onChange={handleShareLink}
            options={[
              {
                value: "link",
                label: "Sao chép liên kết",
              },
              {
                value: "facebook",
                label: "Chia sẻ lên Facebook",
              },
            ]}
          />
          <Button className="button" onClick={handleEdit}>
            <FontAwesomeIcon icon={faPen} />
            Chỉnh sửa
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
      <FloatButton.Group shape="circle" style={{ insetInlineEnd: 94 }}>
        <FloatButton
          type="primary"
          onClick={showModal}
          tooltip="Mô tả lộ trình"
          icon={<FontAwesomeIcon icon={faBook} />}
        />
        <FloatButton
          type="primary"
          onClick={handleMap}
          tooltip="Xem bản đồ"
          icon={<FontAwesomeIcon icon={faMap} />}
        />
        <FloatButton
          type="primary"
          onClick={handlePayment}
          tooltip="Thanh toán dịch vụ"
          icon={<FontAwesomeIcon icon={faMoneyBill} />}
        />
      </FloatButton.Group>
      <ToastContainer />
      <Modal
        title="Mô tả lộ trình"
        width="50%"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {loading ? (
          <div>Đang tạo mô tả lộ trình từ AI...</div>
        ) : (
          <div style={{ whiteSpace: "pre-line" }}>
            {experience ? (
              <>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <TextToSpeech text={experience.slice(0, 200)} />
                </div>
                <Markdown>{experience}</Markdown>
              </>
            ) : (
              <div>Không có dữ liệu mô tả lộ trình.</div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ScheduleDetail;
