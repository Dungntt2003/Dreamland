import "./header.scss";
import Navbar from "react-bootstrap/Navbar";
import Logo from "assets/image/logo.png";
import { Button, Select } from "antd";
import VN from "assets/image/vietnamese.png";
import EN from "assets/image/english.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  return (
    <div>
      <Navbar className="navbar">
        <Navbar.Brand href="#home" className="white-color">
          <img
            alt="logo"
            src={Logo}
            width="30"
            height="30"
            className="d-inline-block align-top"
          />
          Dalat Dreamland
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text className="set-margin white-color">
            <FontAwesomeIcon icon={faPhone} style={{ marginRight: "4px" }} />
            Hotline: 09352192002
          </Navbar.Text>
          <Select
            defaultValue="vietnamese"
            className="button-register set-margin"
            style={{
              minWidth: "120px",
            }}
            // onChange={handleChange}
            options={[
              {
                value: "vietnamese",
                label: (
                  <>
                    <img src={VN} alt="vietnamese" className="language-img" />
                    Tiếng Việt
                  </>
                ),
              },
              {
                value: "english",
                label: (
                  <>
                    <img src={EN} alt="english" className="language-img" />
                    English
                  </>
                ),
              },
            ]}
          />
          <Button variant="outlined" className="button-register set-margin">
            Đăng ký
          </Button>
          <Button variant="outlined" className="button-register set-margin">
            Đăng nhập
          </Button>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
