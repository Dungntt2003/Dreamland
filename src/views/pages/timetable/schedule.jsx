import "./schedule.scss";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "antd";
import { useParams } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import demoRepoApi from "api/demoRepoApi";
import repoApi from "api/repoApi";
const DraggableCalendar = () => {
  const { id } = useParams();
  const calendarRef = useRef(null);
  const externalEventsRef = useRef(null);
  const [date, setDate] = useState(null);
  const [events, setEvents] = useState([
    {
      id: "1",
      title: "Meeting with John",
      start: "2025-01-15T10:00:00",
      end: "2025-01-15T11:00:00",
    },
    {
      id: "2",
      title: "Conference Call",
      start: "2025-01-16T14:00:00",
      end: "2025-01-16T15:00:00",
    },
    {
      id: "3",
      title: "Project Deadline",
      start: "2025-01-20T09:00:00",
      end: "2025-01-20T09:30:00",
    },
  ]);
  const [externalEvents, setExternalEvents] = useState([
    { id: "1", title: "Event 1" },
    { id: "2", title: "Event 2" },
    { id: "3", title: "Event 3" },
    { id: "4", title: "Event 4" },
    { id: "5", title: "Event 5" },
  ]);

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
  }, []);

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

  const renderEventContent = (eventInfo) => {
    return (
      <div style={{ backgroundColor: "var(--secondary-color)" }}>
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
            padding: "0 5px",
            cursor: "pointer",
          }}
        >
          X
        </button>
      </div>
    );
  };

  const getAllEvents = () => {
    const allEvents = calendarRef.current.getApi().getEvents();

    const eventData = allEvents.map((event) => ({
      title: event.title,
      id: event.id,
      start: event.start.toLocaleString(), // Chuyển đổi thành thời gian theo múi giờ địa phương
      end: event.end
        ? event.end.toLocaleString()
        : event.start.toLocaleString(),
    }));

    console.log(eventData);
    return eventData;
  };

  return (
    <div style={{ padding: "16px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "0 0 16px 0",
        }}
      >
        <div>
          <Button className="button" style={{ marginRight: "20px" }}>
            Lưu
          </Button>
          <Button className="button">Hoàn thành</Button>
        </div>
      </div>
      <div style={{ display: "flex", height: "100vh" }}>
        {/* Draggable Events Section */}
        <div style={{ width: "30%" }}>
          <div
            id="external-events-list"
            ref={externalEventsRef}
            className="d-flex flex-wrap"
            style={{ flexDirection: "column", marginTop: "75px" }}
          >
            {externalEvents.map((event) => (
              <div
                key={event.id}
                className="fc-event badge me-3 my-1"
                style={{ backgroundColor: "#1b84ff", padding: "6px 6px" }}
              >
                <div
                  className="fc-event-main"
                  style={{ fontSize: "16px", fontWeight: "400" }}
                >
                  {event.title}
                </div>
              </div>
            ))}
          </div>

          {/* Checkbox for removing events */}
          <div className="mt-2 my-5">
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
          </div>
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
            height="100%"
            // slotDuration="01:00:00"
          />
        </div>
      </div>
    </div>
  );
};

export default DraggableCalendar;
