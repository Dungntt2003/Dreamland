import "./liked-service.scss";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu } from "antd";
import {
  faMountain,
  faWater,
  faHotel,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import LikedItem from "./liked-item";
const items = [
  {
    label: "Địa điểm thăm quan",
    key: "sight",
    icon: <FontAwesomeIcon icon={faMountain} />,
  },
  {
    label: "Địa điểm vui chơi",
    key: "entertainment",
    icon: <FontAwesomeIcon icon={faWater} />,
  },
  {
    label: "Địa điểm ẩm thực",
    key: "restaurant",
    icon: <FontAwesomeIcon icon={faHotel} />,
  },
  {
    label: "Địa điểm nghỉ dưỡng",
    key: "hotel",
    icon: <FontAwesomeIcon icon={faUtensils} />,
  },
];
const LikedService = () => {
  const [current, setCurrent] = useState("sight");
  const onClick = (e) => {
    setCurrent(e.key);
  };
  return (
    <div className="liked-service-container">
      <Menu
        className="liked-service-menu"
        onClick={onClick}
        selectedKeys={[current]}
        mode="vertical"
        items={items}
      />
      <div className="liked-service-list">
        <LikedItem current={current} />
      </div>
    </div>
  );
};

export default LikedService;
