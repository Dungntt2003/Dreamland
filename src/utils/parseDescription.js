const parseDes = (description) => {
  const parts = description.split(";").filter(Boolean);
  const result = {};
  parts.forEach((part) => {
    const [key, value] = part.split(":").map((str) => str.trim());
    if (key && value) {
      result[key] = value;
    }
  });

  return result;
};

const parseList = (list) => {
  return list.split(", ").map((item) => item.trim());
};

export { parseList, parseDes };
