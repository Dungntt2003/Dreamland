const formatCurrency = (value) => {
  if (!value) return "";
  return value.toLocaleString("vi-VN") + " VND";
};

export default formatCurrency;
