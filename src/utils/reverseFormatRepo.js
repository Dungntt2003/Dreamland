const reverseFormat = (formattedArray) => {
  return formattedArray
    .map((event, index) => {
      const { label, children } = event;

      const match = label.match(
        /(\d{2})\/(\d{2})\/(\d{4}), (\d{2}):(\d{2})(?: - (\d{2}):(\d{2}))?/
      );
      if (!match) {
        console.error("Invalid label format:", label);
        return null;
      }

      const [, day, month, year, startHour, startMinute, endHour, endMinute] =
        match;

      const start = new Date(
        Date.UTC(year, month - 1, day, startHour, startMinute)
      );
      const end = endHour
        ? new Date(Date.UTC(year, month - 1, day, endHour, endMinute))
        : start;

      //   console.log(start.toISOString(), end.toISOString());
      return {
        id: index + 1,
        title: children,
        start: start.toISOString(),
        end: end.toISOString(),
      };
    })
    .filter((event) => event !== null);
};

export default reverseFormat;
