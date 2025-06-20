import "./schedule.scss";
import React, { useEffect, useRef, useState } from "react";
import { Button, Tour, Modal } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import demoRepoApi from "api/demoRepoApi";
import repoApi from "api/repoApi";
import toast, { Toaster } from "react-hot-toast";
import entertainmentApi from "api/entertainmentApi";
import sightApi from "api/sightApi";
import restaurantApi from "api/restaurantApi";
import { v4 as uuidv4 } from "uuid";
import convertToEvent from "utils/convertEvent";
import { getAllServices, mapEventToServices } from "utils/getEventService";
import CostCalculator from "components/cost-calculate/cost";
import TravelScheduler from "utils/optimize";
import updateList from "utils/updateActivity";
const DraggableCalendar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [eventServices, setEventServices] = useState([]);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const [open, setOpen] = useState(false);
  const [listServices, setListServices] = useState([]);
  const navigate = useNavigate();
  const steps = [
    {
      title: "Sắp xếp lộ trình",
      description:
        "Từ các dịch vụ bên trái, thực hiện sắp xếp các dịch vụ vào lịch ở bên phải. Khi muốn loại một dịch vụ ra khỏi lịch, ấn nút X bên cạnh dịch vụ đó",
      target: () => ref1.current,
    },
    {
      title: "Lưu tạm thời",
      description:
        "Ấn nút lưu để lưu lộ trình hiện tại trong lịch, bạn có thể trở lại để chọn các dịch vụ khác và tiếp tục sắp xếp vào lộ trình. Nếu không lưu dữ liệu của bạn sẽ mất",
      target: () => ref2.current,
    },
    {
      title: "Hoàn thành",
      description: "Ấn để hoàn thành lộ trình",
      target: () => ref3.current,
    },
  ];
  const { id } = useParams();
  const calendarRef = useRef(null);
  const externalEventsRef = useRef(null);
  const [date, setDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [externalEvents, setExternalEvents] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [numberOfNights, setNumberOfNights] = useState(0);

  const getKeyForService = (item) => {
    switch (item) {
      case "sight":
        return "Tham quan ";
      case "entertainment":
        return "Vui chơi tại ";
      case "hotel":
        return "Nghỉ dưỡng tại ";
      case "restaurant":
        return "Ăn tại ";
      default:
        return "";
    }
  };
  useEffect(() => {
    getAllServices().then(setServices);
  }, []);

  const getNameFromItem = (item) => {
    // console.log(item);
    switch (item.service_type) {
      case "sight":
        return item.sight.name;
      case "entertainment":
        return item.entertainment.name;
      case "hotel":
        return item.hotel.name;
      case "restaurant":
        return item.restaurant.name;
      default:
        return "Unknown item";
    }
  };

  useEffect(() => {
    const getRepoReal = async () => {
      try {
        const response = await repoApi.getADemoRepo(id);
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
        setStartDate(response.data.data.startDate);
        setEndDate(response.data.data.endDate);
        const storedData = localStorage.getItem("schedule");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          if (id === parsedData.id) {
            setEvents(parsedData.data);
          } else
            setEvents(
              response.data?.data?.plan
                ? response.data.data.plan.map(convertToEvent)
                : []
            );
        } else
          setEvents(
            response.data?.data?.plan
              ? response.data.data.plan.map(convertToEvent)
              : []
          );
      } catch (error) {
        console.log(error);
      }
    };
    const getDemoRepo = async () => {
      try {
        const response = await demoRepoApi.getServices(id);
        setExternalEvents(
          response.data.data.map((item) => {
            return {
              id: item.service_id,
              type: item.service_type,
              title:
                getKeyForService(item.service_type) +
                " " +
                getNameFromItem(item),
            };
          })
        );
      } catch (error) {
        console.log(error);
      }
    };
    getRepoReal();
    getDemoRepo();
  }, [id]);

  const draggableInstanceRef = useRef(null);

  useEffect(() => {
    if (externalEventsRef.current && externalEvents.length > 0) {
      if (draggableInstanceRef.current) {
        draggableInstanceRef.current.destroy();
      }
      draggableInstanceRef.current = new Draggable(externalEventsRef.current, {
        itemSelector: ".external-event-item",
        eventData: function (eventEl) {
          return {
            title: eventEl.innerText.trim(),
            id: uuidv4(),
          };
        },
      });
    }

    return () => {
      if (draggableInstanceRef.current) {
        draggableInstanceRef.current.destroy();
      }
    };
  }, [externalEvents]);

  useEffect(() => {
    const getAllServices = async () => {
      try {
        const sightResponse = await sightApi.getAllSights();
        const entertainmentResponse =
          await entertainmentApi.getListEntertaiments();
        const restaurantResponse = await restaurantApi.getRestaurants();
        let combinedData = [
          ...sightResponse.data.data,
          ...entertainmentResponse.data.data,
          ...restaurantResponse.data.data,
        ];
        setListServices(combinedData);
      } catch (error) {
        console.log(error);
      }
    };
    getAllServices();
  }, [id]);

  const handleEventReceive = (info) => {
    const newEvent = {
      id: info.event.id,
      title: info.event.title,
      start: info.event.start,
      end: info.event.end || info.event.start,
      backgroundColor: "var(--secondary-color)",
      borderColor: "var(--secondary-color)",
      textColor: "black",
    };

    setEvents((prevEvents) => {
      if (!prevEvents.some((event) => event.id === newEvent.id)) {
        return [...prevEvents, newEvent];
      }
      return prevEvents;
    });
  };

  const handleDeleteEvent = (eventId) => {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== eventId)
    );
  };

  const handleSave = () => {
    const allEvents = calendarRef.current.getApi().getEvents();

    const eventData = allEvents
      .filter((event) => !event.title.trim().endsWith("Điểm nghỉ ngơi"))
      .map((event) => ({
        title: event.title.replace(/^×\s*/, ""),
        id: event.id,
        start: event.start,
        end: event.end ? event.end : event.start,
      }));

    const jsonData = {
      id: id,
      data: eventData,
    };
    localStorage.setItem("schedule", JSON.stringify(jsonData));
    toast.success("Lưu lộ trình tạm thời");
  };

  const handleFinish = () => {
    const allEvents = calendarRef.current.getApi().getEvents();

    const eventData = allEvents
      .filter((event) => !event.title.trim().endsWith("Điểm nghỉ ngơi"))
      .map((event) => ({
        title: event.title.replace(/^×\s*/, ""),
        id: event.id,
        start: event.start,
        end: event.end ? event.end : event.start,
      }));
    const formatDate = (dateString) => {
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Date(dateString).toLocaleString("en-GB", options);
    };

    const formatTime = (dateString) => {
      const options = {
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Date(dateString).toLocaleString("en-GB", options);
    };

    const sortedEvents = eventData.sort(
      (a, b) => new Date(a.start) - new Date(b.start)
    );

    const resultArray = sortedEvents.map((event) => {
      const formattedStart = formatDate(event.start);
      const formattedEnd = formatTime(event.end);

      return {
        label:
          event.start === event.end
            ? `${formattedStart}`
            : `${formattedStart} - ${formattedEnd}`,
        children: event.title,
      };
    });

    const updateRepoWithPlan = async () => {
      try {
        const response = await repoApi.updatePlan(id, {
          plan: resultArray,
        });

        console.log(response);
        toast.success("Lưu lộ trình thành công");
        setTimeout(() => {
          navigate(`/schedule-detail/${id}`);
        }, 2000);
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
      }
    };
    updateRepoWithPlan();
  };

  const handleReturn = () => {
    navigate(`/create-trip-step1/${id}`);
  };

  const handleRemoveExternalEvent = (eventId, type) => {
    setExternalEvents((prev) => prev.filter((e) => e.id !== eventId));
    const removeFromRepo = async () => {
      try {
        const response = await demoRepoApi.removeService(eventId, type, id);
        // console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    removeFromRepo();
  };

  const handleDeteleAll = () => {
    setEvents([]);
    localStorage.removeItem("schedule");
    calendarRef.current.getApi().removeAllEvents();
  };

  const renderEventContent = (eventInfo) => {
    return (
      <div
        style={{
          fontSize: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span>{eventInfo.event.title.replace(/^×\s*/, "")}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteEvent(eventInfo.event.id);
          }}
          style={{
            marginLeft: "10px",
            background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "22px",
            height: "22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "bold",
            boxShadow: "0 2px 6px rgba(255, 107, 107, 0.3)",
            transition: "all 0.2s ease",
            opacity: "0.85",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.1)";
            e.target.style.opacity = "1";
            e.target.style.boxShadow = "0 4px 12px rgba(255, 107, 107, 0.5)";
            e.target.style.background =
              "linear-gradient(135deg, #ee5a52 0%, #dc2626 100%)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.opacity = "0.85";
            e.target.style.boxShadow = "0 2px 6px rgba(255, 107, 107, 0.3)";
            e.target.style.background =
              "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)";
          }}
          onMouseDown={(e) => {
            e.target.style.transform = "scale(0.95)";
          }}
          onMouseUp={(e) => {
            e.target.style.transform = "scale(1.1)";
          }}
        >
          ×
        </button>
      </div>
    );
  };

  const showModal = () => {
    const allEvents = calendarRef.current.getApi().getEvents();

    const eventData = allEvents
      .filter((event) => !event.title.trim().endsWith("Điểm nghỉ ngơi"))
      .map((event) => ({
        title: event.title.replace(/^×\s*/, ""),
        id: event.id,
        start: event.start,
        end: event.end ? event.end : event.start,
      }));
    const eventServices = mapEventToServices(eventData, services);
    console.log(eventServices);
    setEventServices(eventServices);
    const start = new Date(startDate);
    const end = new Date(endDate);

    const timeDiff = end - start;
    const numberOfNights = timeDiff / (1000 * 60 * 60 * 24);

    setNumberOfNights(numberOfNights);
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOptimize = () => {
    const eventServices = mapEventToServices(externalEvents, services);
    const updateEvents = updateList(eventServices);
    console.log(updateEvents);
    const start = new Date(startDate);
    const end = new Date(endDate);

    const timeDiff = end - start;
    const numberOfNights = timeDiff / (1000 * 60 * 60 * 24);
    try {
      const scheduler = new TravelScheduler();

      const optimizedSchedule = scheduler.optimizeWithSimulatedAnnealing(
        updateEvents,
        numberOfNights + 1,
        5
      );

      const calendarEvents = scheduler.convertToFullCalendarFormat(
        optimizedSchedule,
        start
      );
      console.log(calendarEvents);
      setEvents(calendarEvents);
    } catch (error) {
      console.error("Lỗi khi tạo lịch trình:", error);
    }
  };

  return (
    <div style={{ padding: "16px" }}>
      <div className="schedule-btn-group">
        <Button className="button schedule-btn" onClick={() => setOpen(true)}>
          HƯỚNG DẪN
        </Button>
        <div className="schedule-btn-group-v2">
          <div>
            <Button
              className="button schedule-btn"
              onClick={handleReturn}
              style={{ marginRight: "20px" }}
            >
              Thêm dịch vụ khác
            </Button>
            <Button
              className="button schedule-btn schedule-btn-money"
              onClick={showModal}
            >
              Chi phí dự tính
            </Button>
            <Button
              className="button schedule-btn schedule-btn-rcm"
              onClick={handleOptimize}
            >
              Gợi ý lộ trình
            </Button>
          </div>
          <div>
            <Button
              className="button schedule-btn schedule-btn-delete-all"
              onClick={handleDeteleAll}
            >
              Xóa toàn bộ lịch
            </Button>
            <Button
              className="button schedule-btn"
              style={{ marginRight: "20px" }}
              onClick={handleSave}
              ref={ref2}
            >
              Lưu tạm thời
            </Button>
            <Button
              className="button schedule-btn"
              onClick={handleFinish}
              ref={ref3}
            >
              Hoàn thành
            </Button>
          </div>
        </div>
      </div>
      <div className="schedule-container-detail">
        {/* Draggable Events Section */}
        <div className="schedule-list-services" ref={ref1}>
          <div style={{ fontSize: "30px", margin: "54px 0 24px" }}>DỊCH VỤ</div>
          <div
            id="external-events-list"
            ref={externalEventsRef}
            style={{
              maxHeight: "60vh",
              overflowY: "auto",
            }}
          >
            {externalEvents.map((event, index) => {
              // Mảng màu pastel đẹp
              const pastelColors = [
                { bg: "#fff0f6", border: "#ffadd6", text: "#c41e3a" }, // Pink
                { bg: "#e6fffb", border: "#87e8de", text: "#006d75" }, // Cyan
                { bg: "#f6ffed", border: "#b7eb8f", text: "#389e0d" }, // Green
                { bg: "#fff2e8", border: "#ffbb96", text: "#d4380d" }, // Orange
                { bg: "#f0f5ff", border: "#adc6ff", text: "#1d39c4" }, // Blue
                { bg: "#f9f0ff", border: "#d3adf7", text: "#722ed1" }, // Purple
              ];

              const colorScheme = pastelColors[index % pastelColors.length];

              return (
                <div
                  key={event.id}
                  className="external-event-item fc-event"
                  style={{
                    position: "relative",
                    backgroundColor: colorScheme.bg,
                    border: `2px solid ${colorScheme.border}`,
                    borderRadius: "12px",
                    padding: "12px 24px 12px 14px",
                    margin: "8px",
                    color: colorScheme.text,
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    cursor: "pointer",
                    minWidth: "120px",
                    maxWidth: "400px",
                    display: "inline-block",
                  }}
                >
                  <span
                    onClick={() =>
                      handleRemoveExternalEvent(event.id, event.type)
                    }
                    className="remove-btn"
                    style={{
                      position: "absolute",
                      top: "-8px",
                      right: "-8px",
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      backgroundColor: "#ff4d4f",
                      color: "white",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 6px rgba(255, 77, 79, 0.3)",
                      transition: "all 0.2s ease",
                      zIndex: 10,
                      border: "2px solid white",
                      lineHeight: "1",
                    }}
                  >
                    ×
                  </span>
                  <div
                    className="event-content"
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      lineHeight: "1.4",
                      paddingRight: "8px",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      maxWidth: "100%",
                      display: "block",
                    }}
                  >
                    {event.title}
                  </div>

                  {/* Decorative dot */}
                  <div
                    style={{
                      position: "absolute",
                      top: "8px",
                      left: "8px",
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: colorScheme.border,
                      opacity: 0.6,
                    }}
                  />
                </div>
              );
            })}
          </div>
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
            editable={true}
            droppable={true}
            initialView="timeGridDay"
            validRange={{
              start: date ? date.start : null,
              end: date ? date.end : null,
            }}
            eventAllow={(dropInfo, draggedEvent) => {
              const startHour = dropInfo.start.getHours();
              const eventType = draggedEvent._def.title;
              if (eventType.includes("Ăn tại") && startHour <= 10) {
                return false;
              }
              return true;
            }}
            events={events}
            slotMinTime="07:00:00"
            slotMaxTime="22:00:00"
            eventReceive={handleEventReceive}
            eventContent={renderEventContent}
            locale="vi"
            timeZone="local"
            className="shedule-fullcalendar"
            height="80%"
          />
        </div>
      </div>
      <Toaster />
      <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
      <Modal
        title="Chi phí dự tính cho lộ trình"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        className="cost-modal-schedule"
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
    </div>
  );
};

export default DraggableCalendar;
