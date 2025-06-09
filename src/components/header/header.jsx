import "./header.scss";
import Navbar from "react-bootstrap/Navbar";
import Logo from "assets/image/logo_v2.png";
import { Button, Select, Dropdown, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import VN from "assets/image/vietnamese.png";
import EN from "assets/image/english.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "context/authContext";

const Header = () => {
  const { isAuthenticated, logout, role, id } = useAuth();
  const { t, i18n } = useTranslation();
  const handleLogout = () => {
    logout();
  };
  const items = [
    {
      key: "1",
      label: (
        <Link to={`/personal-info/${id}`} className="link">
          Thông tin tài khoản
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <Link to={`/favorite`} className="link">
          Danh sách yêu thích
        </Link>
      ),
    },
    {
      key: "3",
      label: (
        <Link to={`/repository/hidden`} className="link">
          Lộ trình đã ẩn
        </Link>
      ),
    },
    {
      key: "4",
      label: (
        <Link
          to={`/login`}
          className="link"
          style={{ color: "red" }}
          onClick={handleLogout}
        >
          Đăng xuất
        </Link>
      ),
    },
  ];
  const handleChange = (value) => {
    i18n.changeLanguage(value);
  };

  return (
    <div className="header-wrap">
      <Navbar className="navbar">
        <Link to="/homepage" className="link">
          <Navbar.Brand className="white-color">
            <img
              alt="logo"
              src={Logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />
            Smart Trip
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Select
            defaultValue="vi"
            className="button-register set-margin"
            style={{
              minWidth: "120px",
            }}
            onChange={handleChange}
            options={[
              {
                value: "vi",
                label: (
                  <>
                    <img src={VN} alt="vietnamese" className="language-img" />
                    Tiếng Việt
                  </>
                ),
              },
              {
                value: "en",
                label: (
                  <>
                    <img src={EN} alt="english" className="language-img" />
                    English
                  </>
                ),
              },
            ]}
          />
          {isAuthenticated === true ? (
            <>
              <Dropdown
                menu={{
                  items,
                }}
              >
                <div
                  onClick={(e) => e.preventDefault()}
                  className="link"
                  style={{ margin: "0 16px", color: "var(--white-color)" }}
                >
                  <Space>
                    Xin chào <FontAwesomeIcon icon={faUser} />
                    <DownOutlined />
                  </Space>
                </div>
              </Dropdown>
            </>
          ) : (
            <>
              <Button variant="outlined" className="button-register set-margin">
                <Link to="/register" className="link">
                  {t("register")}
                </Link>
              </Button>
              <Button variant="outlined" className="button-register set-margin">
                <Link to="/login" className="link">
                  {t("login")}
                </Link>
              </Button>
            </>
          )}
        </Navbar.Collapse>
      </Navbar>
      <div className="subHeader-container">
        {role === "user" && (
          <div className="subHeader-item">
            <Link className="link" to={"/repository"}>
              Lộ trình
            </Link>
          </div>
        )}
        <div className="subHeader-item">
          <Link className="link" to={"/sight"}>
            Địa điểm tham quan
          </Link>
        </div>
        <div className="subHeader-item">
          <Link className="link" to={"/entertainment"}>
            Địa điểm vui chơi
          </Link>
        </div>
        <div className="subHeader-item">
          <Link className="link" to={"/restaurant"}>
            Địa điểm ẩm thực
          </Link>
        </div>
        <div className="subHeader-item">
          <Link className="link" to="/hotel">
            Địa điểm nghỉ dưỡng
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
