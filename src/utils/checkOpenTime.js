const checkOpen = (startTime, endTime) => {
  const now = new Date();

  if (now.getHours() >= startTime && now.getHours() <= endTime) {
    return true;
  }

  return false;
};

export default checkOpen;
