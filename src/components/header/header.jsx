import "./header.scss";
import Navbar from "react-bootstrap/Navbar";
import Logo from "assets/image/logo.png";
import { Button, Select } from "antd";
import VN from "assets/image/vietnamese.png";
import EN from "assets/image/english.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "context/authContext";

const Header = () => {
  const { isAuthenticated, logout, role, id } = useAuth();
  const { t, i18n } = useTranslation();
  // const handleChange = (value) => {
  //   i18n.changeLanguage(value);
  // };
  const handleChoose = (value) => {
    console.log(value);
  };
  const handleLogout = () => {
    logout();
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
            Dalat Dreamland
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text className="set-margin white-color">
            <FontAwesomeIcon icon={faPhone} style={{ marginRight: "4px" }} />
            {t("hotline")}: 09352192002
          </Navbar.Text>
          <Select
            defaultValue="vi"
            className="button-register set-margin"
            style={{
              minWidth: "120px",
            }}
            // onChange={handleChange}
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
              <Navbar.Text className="set-margin white-color">
                <Link className="link white-color" to={`/personal-info/${id}`}>
                  Xin chào
                  <FontAwesomeIcon
                    icon={faUser}
                    style={{ margin: "0px 8px 0 4px" }}
                  />
                </Link>
              </Navbar.Text>
              <Button
                variant="outlined"
                className="button-register set-margin"
                onClick={handleLogout}
              >
                Đăng xuất
              </Button>
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
      {role === "user" ? (
        <>
          <div className="subHeader-container">
            <div className="subHeader-item">
              <Select
                className="subHeader-select"
                placeholder="Địa điểm"
                onChange={handleChoose}
                options={[
                  { value: "place", label: "Địa điểm du lịch" },
                  { value: "service", label: "Địa điểm tiện ích" },
                ]}
              />
            </div>
            <div className="subHeader-item">
              <Link className="link">Tin tức & sự kiện</Link>
            </div>
            <div className="subHeader-item">
              <Link className="link">Địa điểm ẩm thực</Link>
            </div>
            <div className="subHeader-item">
              <Link className="link"> Địa điểm nghĩ dưỡng</Link>
            </div>
            <div className="subHeader-item">
              <Link className="link">Đặc sản</Link>
            </div>
            <div className="subHeader-item">
              <Link className="link">Giới thiệu</Link>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Header;
