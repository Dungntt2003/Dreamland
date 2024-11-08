import { jwtDecode } from "jwt-decode";
import axios from "axios";
export const getToken = async () => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/protected`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return token;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.error("Phiên làm việc hết hạn, vui lòng đăng nhập lại");
      localStorage.removeItem("token");
    } else {
      console.error("Lỗi xác thực", error);
    }
  }
};

export const getUserFromToken = () => {
  const token = getToken();
  return token ? jwtDecode(token) : null;
};
