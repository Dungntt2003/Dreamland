import "./header.scss";
import Navbar from "react-bootstrap/Navbar";
import Logo from "assets/image/logo.png";

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
          <Navbar.Text className="white-color">
            Signed in as:
            <a href="#login" className="white-color">
              Mark Otto
            </a>
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
