import "./scheduleDetail.scss";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import repoApi from "api/repoApi";
import { Timeline, Button, Select, FloatButton, Modal } from "antd";
import ExportToDOCX from "utils/exportToDOCX";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faMap,
  faCopy,
  faBook,
  faMoneyBill,
  faTimeline,
  faMoneyCheckDollar,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import toast, { Toaster } from "react-hot-toast";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ReactMarkdown from "react-markdown";
import reverseFormat from "utils/reverseFormatRepo";
import aiApi from "api/aiApi";
import Markdown from "react-markdown";
import TextToSpeech from "components/text-to-speech/TTP";
import generateItineraryDescription from "utils/genDescription";
import { getAllServices, mapEventToServices } from "utils/getEventService";
import CostCalculator from "components/cost-calculate/cost";
import { useAuth } from "context/authContext";
import demoRepoApi from "api/demoRepoApi";
import entertainmentApi from "api/entertainmentApi";
import sightApi from "api/sightApi";
import restaurantApi from "api/restaurantApi";
import hotelApi from "api/hotelApi";
const ScheduleDetail = () => {
  const { id: userId } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const calendarRef = useRef(null);
  const [services, setServices] = useState([]);
  const [listServices, setListServices] = useState([]);
  const [plan, setPlan] = useState([]);
  const [eventServices, setEventServices] = useState([]);
  const [repo, setRepo] = useState(null);
  const [events, setEvents] = useState([]);
  const [item, setItem] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenDes, setIsModalOpenDes] = useState(false);
  const [isModalOpenCost, setIsModalOpenCost] = useState(false);
  const [isModalOpenRemove, setIsModalOpenRemove] = useState(false);
  const [date, setDate] = useState(null);
  const [destination, setDestination] = useState("");
  const [experience, setExperience] = useState(null);
  const [query, setQuery] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [numberOfNights, setNumberOfNights] = useState(0);
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
        setStartDate(response.data.data.startDate);
        setEndDate(response.data.data.endDate);
        setDestination(response.data.data.destination);
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

  useEffect(() => {
    const getAllServices = async () => {
      try {
        const sightResponse = await sightApi.getAllSights();
        const entertainmentResponse =
          await entertainmentApi.getListEntertaiments();
        const restaurantResponse = await restaurantApi.getRestaurants();
        const hotelResponse = await hotelApi.getListHotels();

        let combinedData = [
          ...sightResponse.data.data,
          ...entertainmentResponse.data.data,
          ...restaurantResponse.data.data,
          ...hotelResponse.data.data,
        ];

        setListServices(combinedData);
      } catch (error) {
        console.log(error);
      }
    };

    getAllServices();
  }, [id]);

  useEffect(() => {
    getAllServices().then(setServices);
  }, []);

  useEffect(() => {
    if (repo && repo.plan && listServices.length > 0) {
      const mappedLocations = repo.plan
        .map((p) => {
          const matchedServices = listServices.filter(
            (s) => p.children && p.children.trim().endsWith(s.name.trim())
          );
          const firstMatch = matchedServices[0];
          if (!firstMatch) return null;

          let routePrefix = "";

          if (p.children.startsWith("Tham quan")) {
            routePrefix = "sight-seeing-detail";
          } else if (p.children.startsWith("Vui chơi")) {
            routePrefix = "entertainment-detail";
          } else if (p.children.startsWith("Ăn")) {
            routePrefix = "restaurant-detail";
          } else if (p.children.startsWith("Nghỉ dưỡng")) {
            routePrefix = "hotel-detail";
          } else {
            return null;
          }

          return {
            label: p.label,
            children: (
              <Link to={`/${routePrefix}/${firstMatch.id}`}>{p.children}</Link>
            ),
          };
        })
        .filter(Boolean);
      // console.log(mappedLocations);
      setPlan(mappedLocations);
    }
  }, [repo, listServices]);

  const showModalDes = () => {
    setIsModalOpenDes(true);
  };
  const showModalCost = () => {
    const allEvents = calendarRef.current.getApi().getEvents();

    const eventData = allEvents.map((event) => ({
      title: event.title.replace(/^×\s*/, ""),
      id: event.id,
      start: event.start,
      end: event.end ? event.end : event.start,
    }));
    const eventServices = mapEventToServices(eventData, services);
    setEventServices(eventServices);
    const start = new Date(startDate);
    const end = new Date(endDate);

    const timeDiff = end - start;
    const numberOfNights = timeDiff / (1000 * 60 * 60 * 24);

    setNumberOfNights(numberOfNights);
    setIsModalOpenCost(true);
  };

  const handleOkDes = () => {
    setIsModalOpenDes(false);
  };
  const handleCancelDes = () => {
    setIsModalOpenDes(false);
  };

  const getAiGen = async () => {
    try {
      const params = {
        itinerary: query,
        destination: destination,
      };
      const cached = await repoApi.getADemoRepo(id);
      if (
        cached.data.data &&
        cached.data.data.experience &&
        cached.data.data.experience !== ""
      ) {
        setExperience(cached.data.data.experience);
        return;
      }
      const response = await aiApi.getDetailWithAI(params);
      // console.log(response);
      setExperience(response.data.data);

      const saveInRepo = await repoApi.updatePlan(id, {
        experience: response.data.data,
      });
      console.log(saveInRepo);
    } catch (error) {
      console.log(error);
      setExperience("Lỗi khi lấy dữ liệu từ AI.");
    } finally {
      setLoading(false);
    }
  };

  const showModalRemove = () => {
    setIsModalOpenRemove(true);
  };
  const handleOkRemove = () => {
    const removeRepo = async () => {
      try {
        await repoApi.deleteRepo(id);
        toast.success("Xóa lộ trình thành công");
        setTimeout(() => {
          navigate("/repository");
        }, 3000);
      } catch (error) {
        console.error("Error removing repo:", error);
        toast.error("Xóa lộ trình thất bại");
      }
    };
    removeRepo();
  };
  const handleCancelRemove = () => {
    setIsModalOpenRemove(false);
  };

  const showModal = () => {
    setIsModalOpen(true);
    setExperience(null);
    setLoading(true);
    getAiGen();
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOkCost = () => {
    setIsModalOpenCost(false);
  };

  const handleCancelCost = () => {
    setIsModalOpenCost(false);
  };

  const handleExportEx = (data) => {
    ExportToDOCX(data, "experience.docx", "Cẩm nang cho lộ trình");
  };

  const handleExportDes = (data) => {
    ExportToDOCX(data, "itinerary-description.docx", "Mô tả lộ trình");
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
      const currentUrl = window.location.href;
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        currentUrl
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
        toast("Link đã được copy vào clipboard");
      });
    }
  };

  const handleCopy = () => {
    const params = {
      name: `${repo.name} - Bản sao`,
      description: repo.description,
      destination: repo.destination,
      startDate: repo.startDate,
      endDate: repo.endDate,
      plan: repo.plan ? repo.plan : null,
      experience: repo.experience ? repo.experience : null,
      numberPeople: repo.numberPeople,
      isHidden: false,
      user_id: userId,
    };
    const createCopy = async () => {
      try {
        const response = await repoApi.createARepo(params);
        const repo_id = response.data.data.id;

        const addServiceCalls = repo.demorepodetail.map((service) =>
          demoRepoApi.addAService({
            service_id: service.service_id,
            repository_id: repo_id,
            service_type: service.service_type,
          })
        );

        await Promise.all(addServiceCalls);

        toast.success("Tạo bản sao thành công");

        setTimeout(() => {
          navigate("/repository");
        }, 3000);
      } catch (error) {
        console.log("Error creating copy:", error);
        toast.error("Tạo bản sao thất bại");
      }
    };

    createCopy();
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
        <div className="schedule-detail-group-btn">
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
          <Button className="button" onClick={handleCopy}>
            <FontAwesomeIcon icon={faCopy} />
            Tạo bản sao
          </Button>
          <Button
            className="button button-delete-repo"
            onClick={showModalRemove}
          >
            <FontAwesomeIcon icon={faTrash} />
            Xóa lộ trình
          </Button>
          <Button className="button" onClick={handleReturnHomepage}>
            Trở về trang chủ
          </Button>
        </div>
      </div>
      <div
        className="header2 register-header"
        style={{ textAlign: "center", textTransform: "uppercase" }}
      >
        CHI TIẾT LỘ TRÌNH DU LỊCH {repo && repo.name}
      </div>
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-around",
        }}
        className="schedule-detail-container"
      >
        <div className="timeline-container">
          <Timeline mode="left" items={plan} />
        </div>
        <div id="kt_docs_fullcalendar_drag">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
            }}
            initialView="timeGridDay"
            validRange={{
              start: date ? date.start : null,
              end: date ? date.end : null,
            }}
            events={events}
            slotMinTime="07:00:00"
            slotMaxTime="22:00:00"
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
          onClick={showModalDes}
          tooltip="Mô tả lộ trình"
          icon={<FontAwesomeIcon icon={faTimeline} />}
        />
        <FloatButton
          type="primary"
          onClick={showModal}
          tooltip="Cẩm nang cho lộ trình"
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
          onClick={showModalCost}
          tooltip="Tính toán chi phí"
          icon={<FontAwesomeIcon icon={faMoneyCheckDollar} />}
        />
        <FloatButton
          type="primary"
          onClick={handlePayment}
          tooltip="Thanh toán dịch vụ"
          icon={<FontAwesomeIcon icon={faMoneyBill} />}
        />
      </FloatButton.Group>
      <Toaster />
      <Modal
        title="Cẩm nang cho lộ trình"
        width="70%"
        className="schedule-detail-experience"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {loading ? (
          <div>Đang tạo cẩm nang cho lộ trình từ AI...</div>
        ) : (
          <div style={{ whiteSpace: "pre-line" }}>
            {experience ? (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: "24px",
                  }}
                  className="schedule-detail-experience-header"
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-around" }}
                    className="text-to-speech-container"
                  >
                    <TextToSpeech text={experience.slice(0, 400)} />
                  </div>
                  <div style={{ marginLeft: "16px" }}>
                    <Button
                      className="button"
                      onClick={() => handleExportEx(experience)}
                    >
                      In cẩm nang
                    </Button>
                  </div>
                </div>
                <ReactMarkdown>{experience}</ReactMarkdown>
              </>
            ) : (
              <div>Không có dữ liệu cẩm nang.</div>
            )}
          </div>
        )}
      </Modal>
      <Modal
        title="Mô tả lộ trình"
        width="50%"
        className="schedule-detail-description"
        open={isModalOpenDes}
        onOk={handleOkDes}
        onCancel={handleCancelDes}
      >
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            className="button"
            onClick={() => handleExportDes(generateItineraryDescription(item))}
          >
            In mô tả
          </Button>
        </div>
        <Markdown>{generateItineraryDescription(item)}</Markdown>
      </Modal>
      <Modal
        title="Mô tả lộ trình"
        width="70%"
        className="schedule-detail-description"
        open={isModalOpenCost}
        onOk={handleOkCost}
        onCancel={handleCancelCost}
      >
        <p style={{ color: "red" }}>
          Lưu ý: Tất cả các tính toán chỉ là dự tính, mang tính chất tham khảo
        </p>
        <div>
          <CostCalculator
            eventData={eventServices}
            numberOfNights={numberOfNights}
          />
        </div>
      </Modal>
      <Modal
        title="❗ Xác nhận xóa lộ trình"
        open={isModalOpenRemove}
        onOk={handleOkRemove}
        onCancel={handleCancelRemove}
        okText="Xóa"
        cancelText="Hủy"
        className="custom-delete-modal"
      >
        <p>
          Bạn có chắc chắn muốn <strong>xóa</strong> lộ trình này không?
        </p>
        <p style={{ color: "red", fontWeight: "500" }}>
          Hành động này sẽ <u>không thể hoàn tác</u>.
        </p>
      </Modal>
    </div>
  );
};

export default ScheduleDetail;
