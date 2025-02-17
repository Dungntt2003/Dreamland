import "./schedule.scss";
import React, { useEffect, useRef, useState } from "react";
import { Button, Tour } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import demoRepoApi from "api/demoRepoApi";
import repoApi from "api/repoApi";
import { ToastContainer, toast } from "react-toastify";
import entertainmentApi from "api/entertainmentApi";
import sightApi from "api/sightApi";
import restaurantApi from "api/restaurantApi";
// import ExportToDOCX from "utils/exportToDOCX";
const DraggableCalendar = () => {
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const [open, setOpen] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [time, setTime] = useState("");
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

  const getNameFromItem = (item) => {
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
      } catch (error) {
        console.log(error);
      }
    };
    const getDemoRepo = async () => {
      try {
        const response = await demoRepoApi.getServices(id);
        // console.log(response);
        setExternalEvents(
          response.data.data.map((item) => {
            return {
              id: item.id,
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
    // console.log(externalEvents);
    getRepoReal();
    // console.log(date);
    getDemoRepo();
  }, [id]);

  useEffect(() => {
    const storedData = localStorage.getItem("schedule");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (id === parsedData.id) {
        setEvents(parsedData.data);
      }
    }
    // Initialize external draggable events
    new Draggable(externalEventsRef.current, {
      itemSelector: ".fc-event",
      eventData: function (eventEl) {
        return {
          title: eventEl.innerText.trim(),
          id: String(new Date().getTime()),
        };
      },
    });
  }, [id]);

  const handleEventReceive = (info) => {
    const newEvent = {
      id: info.event.id,
      title: info.event.title,
      start: info.event.start,
      end: info.event.end || info.event.start,
      backgroundColor: "var(--secondary-color)",
      borderColor: "var(--secondary-color)",
      textColor: "white",
    };
    // Add event to state
    setEvents((prevEvents) => [...prevEvents, newEvent]);

    // Remove the event from FullCalendar (this prevents the default duplicate behavior)
    info.event.remove();
  };

  const handleDeleteEvent = (eventId) => {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== eventId)
    );
  };

  const handleSave = () => {
    const allEvents = calendarRef.current.getApi().getEvents();

    const eventData = allEvents.map((event) => ({
      title: event.title,
      id: event.id,
      start: event.start,
      end: event.end ? event.end : event.start,
    }));

    const jsonData = {
      id: id,
      data: eventData,
    };
    localStorage.setItem("schedule", JSON.stringify(jsonData));
  };

  const handleFinish = () => {
    const allEvents = calendarRef.current.getApi().getEvents();

    const eventData = allEvents.map((event) => ({
      title: event.title,
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

    // localStorage.setItem(
    //   "finalSchedule",
    //   JSON.stringify({
    //     id: id,
    //     events: resultArray,
    //   })
    // );

    // console.log("Result array saved to localStorage:", resultArray);
    const updateRepoWithPlan = async () => {
      try {
        const response = await repoApi.updatePlan(id, {
          plan: resultArray,
        });

        console.log(response);
        toast.success("Tạo lộ trình thành công", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setTimeout(() => {
          navigate(`/schedule-detail/${id}`);
        }, 2000);
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setTimeout(() => {
          navigate(`/schedule-detail/${id}`);
        }, 2000);
      }
    };
    updateRepoWithPlan();

    // if (typeof result === "string" && result.trim()) {
    //   ExportToDOCX(result);
    // } else {
    //   console.error("Dữ liệu không hợp lệ");
    // }
    // const jsonData = {
    //   id: id,
    //   data: eventData,
    // };
    // localStorage.setItem("finalSchedule", JSON.stringify(jsonData));
  };

  // const handleHover = (id, type) => {
  //   console.log(id + " " + type);
  //   setIsHover(true);
  //   if (type === "sight") {
  //     const getTimeOfSight = async () => {
  //       try {
  //         const response = await sightApi.getSightDetail(id);
  //         console.log(response);
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     };
  //     getTimeOfSight();
  //   } else if (type === "entertainment") {
  //     const getTimeOfEntertainment = async () => {
  //       try {
  //         const response = await entertainmentApi.getEntertainmentDetail(id);
  //         console.log(response);
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     };
  //     getTimeOfEntertainment();
  //   } else if (type === "restaurant") {
  //     const getTimeOfRestaurant = async () => {
  //       try {
  //         const response = await restaurantApi.getRestaurantDetail(id);
  //         console.log(response);
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     };
  //     getTimeOfRestaurant();
  //   }
  // };

  const renderEventContent = (eventInfo) => {
    return (
      <div style={{ fontSize: "16px" }}>
        <span>{eventInfo.event.title}</span>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering event click
            handleDeleteEvent(eventInfo.event.id);
          }}
          style={{
            marginLeft: "10px",
            background: "red",
            color: "white",
            border: "none",
            borderRadius: "50%",
            padding: "0px 8px",
            cursor: "pointer",
          }}
        >
          X
        </button>
      </div>
    );
  };

  return (
    <div style={{ padding: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button className="button" onClick={() => setOpen(true)}>
          HƯỚNG DẪN
        </Button>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            margin: "0 0 16px 0",
          }}
        >
          <div>
            <Button
              className="button"
              style={{ marginRight: "20px" }}
              onClick={handleSave}
              ref={ref2}
            >
              Lưu
            </Button>
            <Button className="button" onClick={handleFinish} ref={ref3}>
              Hoàn thành
            </Button>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", height: "100vh" }}>
        {/* Draggable Events Section */}
        <div style={{ width: "30%", marginLeft: "24px" }}>
          <div style={{ fontSize: "30px", margin: "54px 0 24px" }}>DỊCH VỤ</div>
          <div
            id="external-events-list"
            ref={externalEventsRef}
            // className="d-flex flex-wrap"
            style={{
              // flexDirection: "column",
              maxHeight: "60vh",
              overflowY: "auto",
            }}
          >
            {externalEvents.map((event) => (
              <div
                key={event.id}
                className="fc-event badge me-3 my-1"
                style={{
                  backgroundColor: "#74c476",
                  padding: "6px 6px",
                  color: "black",
                }}
                // onMouseEnter={() => handleHover(event.id, event.type)}
                // onMouseLeave={() => setIsHover(false)}
              >
                <div
                  className="fc-event-main"
                  style={{ fontSize: "14px", fontWeight: "200" }}
                >
                  {event.title}
                </div>
              </div>
            ))}
          </div>

          {/* Checkbox for removing events */}
          {/* <div className="mt-2 my-5">
            <div className="form-check form-check-custom form-check-solid">
              <input
                className="form-check-input"
                type="checkbox"
                id="drop-remove"
              />
              <label className="form-check-label" htmlFor="drop-remove">
                Xóa địa điểm khi kéo thả
              </label>
            </div>
          </div> */}
        </div>

        {/* <div>
        <button onClick={getAllEvents}>Get All Events</button>
      </div> */}

        {/* FullCalendar */}
        <div id="kt_docs_fullcalendar_drag" style={{ width: "70%" }}>
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
            initialDate="2025-01-20"
            validRange={{
              start: date ? date.start : null,
              end: date ? date.end : null,
            }}
            events={events}
            slotMinTime="07:00:00"
            slotMaxTime="22:00:00"
            eventReceive={handleEventReceive}
            eventContent={renderEventContent}
            locale="vi"
            timeZone="local"
            height="80%"
            // slotDuration="01:00:00"
          />
        </div>
      </div>
      <ToastContainer />
      <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
    </div>
  );
};

export default DraggableCalendar;
