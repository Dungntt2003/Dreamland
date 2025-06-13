const updateList = (activities) => {
  const updatedActivities = activities.map((item) => {
    let type = "";

    if (item.title.includes("Tham quan")) {
      type = "sight";
    } else if (item.title.includes("Vui chơi")) {
      type = "entertainment";
    } else if (item.title.includes("Ăn")) {
      type = "restaurant";
    } else if (item.title.includes("Nghỉ")) {
      type = "hotel";
    }

    return {
      ...item,
      type,
    };
  });
  return updatedActivities;
};

export default updateList;
