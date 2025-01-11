import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";

const DraggableCalendar = () => {
  const calendarRef = useRef(null);
  const externalEventsRef = useRef(null);
  const [events, setEvents] = useState([
    // Các sự kiện được thêm sẵn vào lịch
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

  useEffect(() => {
    // Initialize external draggable events
    new Draggable(externalEventsRef.current, {
      itemSelector: ".fc-event",
      eventData: function (eventEl) {
        return {
          title: eventEl.innerText.trim(),
          id: String(new Date().getTime()), // Generate a unique id for the event
        };
      },
    });
  }, []);

  const handleEventReceive = (info) => {
    const newEvent = {
      id: String(new Date().getTime()), // Unique ID
      title: info.event.title,
      start: info.event.start,
      end: info.event.end || info.event.start,
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
      <div>
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
    <div className="container">
      {/* Draggable Events Section */}
      <div>
        <h4 className="mb-3">Draggable Events</h4>
        <div
          id="external-events-list"
          ref={externalEventsRef}
          className="d-flex flex-wrap"
        >
          {externalEvents.map((event) => (
            <div key={event.id} className="fc-event badge me-3 my-1">
              <div className="fc-event-main">{event.title}</div>
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
              Remove event after drop
            </label>
          </div>
        </div>
      </div>

      <div>
        <button onClick={getAllEvents}>Get All Events</button>
      </div>

      {/* FullCalendar */}
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
          droppable={true} // Allows dropping external events onto the calendar
          initialView="dayGridMonth"
          events={events}
          eventReceive={handleEventReceive} // Triggered when an external event is dropped
          eventContent={renderEventContent} // Render the event content with delete button
          locale="vi"
          timeZone="local"
        />
      </div>
    </div>
  );
};

export default DraggableCalendar;
