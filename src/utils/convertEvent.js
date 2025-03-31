import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

const convertToEvent = (item) => {
  const [date, timeRange] = item.label.split(", ");
  const [startTime, endTime] = timeRange.split(" - ");

  const start = dayjs(`${date} ${startTime}`, "DD/MM/YYYY HH:mm").toISOString();
  const end = dayjs(`${date} ${endTime}`, "DD/MM/YYYY HH:mm").toISOString();

  return {
    id: uuidv4(),
    title: item.children,
    start,
    end,
  };
};

export default convertToEvent;
