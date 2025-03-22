const formatLocation = (location) => {
  return location.replace(/^Tỉnh |^Thành phố /, "");
};

export default formatLocation;
